import "./story.css";
import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router";
import StoryView from "./StoryView";
import { EmptyState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useSubscription } from "../../hooks/useSubscription";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import {
  getStory,
  subscribeStoryReviews,
  getUserProfileMap,
  addReview,
  updateReview,
  toggleReviewLike,
} from "../../firebase/db";
import { displayNameOf, timeAgo } from "../../lib/format";
import { LIMITS } from "../../lib/validation";

function StarPicker({ value, onChange, id }) {
  return (
    <div className="stars" role="radiogroup" aria-labelledby={id}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          className={`star ${star <= value ? "active" : ""}`}
          onClick={() => onChange(star)}
        >
          <i className="fa-solid fa-star" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ initial, onSubmit, busy, submitLabel }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [topic, setTopic] = useState(initial?.topic || "");
  const [message, setMessage] = useState(initial?.message || "");
  const [error, setError] = useState("");

  // Re-seed when the form switches between "write" and "edit".
  useEffect(() => {
    setRating(initial?.rating || 0);
    setTopic(initial?.topic || "");
    setMessage(initial?.message || "");
    setError("");
  }, [initial]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!rating) return setError("Please choose a star rating.");
    if (!topic.trim()) return setError("Please add a short review topic.");
    if (!message.trim()) return setError("Please write your review.");

    setError("");
    onSubmit({ rating, topic: topic.trim(), message: message.trim() });
  }

  return (
    <form className="write-review" onSubmit={handleSubmit} noValidate>
      <label id="rating-label">Your Rating:</label>
      <StarPicker id="rating-label" value={rating} onChange={setRating} />

      <label htmlFor="review-topic">Topic</label>
      <input
        id="review-topic"
        type="text"
        placeholder="Review Topic"
        maxLength={LIMITS.reviewTopic}
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
      />

      <label htmlFor="review-message">Your Review</label>
      <textarea
        id="review-message"
        rows={5}
        placeholder="What did you think of this series?"
        maxLength={LIMITS.reviewMessage}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      {error && (
        <p className="inline-message inline-message--error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy}>
        <i className="fa-solid fa-paper-plane" aria-hidden="true" />{" "}
        {busy ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

export default function StoryReviews() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  const { data: story } = useAsyncData(() => getStory(id), [id]);
  // getUserProfileMap is a live `onValue` subscription, not a promise, so it must
  // go through useSubscription to get teardown and display-name updates.
  const { data: users } = useSubscription((cb) => getUserProfileMap(cb), [], { initial: {} });

  // Live reviews: new posts, edits and like counts all arrive without a refetch.
  const { data: reviews, loading } = useSubscription(
    (cb) => subscribeStoryReviews(id, cb),
    [id],
    { initial: [] }
  );

  const [editingId, setEditingId] = useState(null);

  const list = useMemo(
    () => [...(reviews || [])].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [reviews]
  );

  const myReview = user ? list.find((review) => review.userId === user.uid) : null;
  const isAuthor = user && story && user.uid === story.authorId;

  const stats = useMemo(() => {
    const total = list.length;
    const buckets = [5, 4, 3, 2, 1].map((star) => list.filter((r) => r.rating === star).length);
    const avg = total ? list.reduce((sum, r) => sum + (r.rating || 0), 0) / total : 0;
    return { total, buckets, avg };
  }, [list]);

  const editing = editingId ? list.find((r) => r.id === editingId) : null;

  async function handleSubmit(data) {
    if (!user) {
      toast.info("Please sign in to write a review.");
      return;
    }
    await run(
      () =>
        myReview
          ? updateReview(myReview.id, { ...data, userId: user.uid })
          : addReview({ ...data, storyId: id, userId: user.uid }),
      {
        success: myReview ? "Your review has been updated." : "Thanks for your review!",
        onSuccess: () => setEditingId(null),
      }
    );
  }

  async function handleLike(review) {
    if (!user) {
      toast.info("Please sign in to like reviews.");
      return;
    }
    await run(() => toggleReviewLike(review.id, user.uid));
  }

  if (!story) {
    return (
      <div className="storyview-page">
        <EmptyState
          icon="fa-triangle-exclamation"
          title="Series not found"
          message="This series may have been removed by its author."
          action={
            <Link to="/search-discovery" className="btn btn-yellow">
              Browse other series
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="storyview-page">
      <StoryView />

      <div className="reviews-container">
        <h2>
          Reviews ({stats.total}) —{" "}
          <span className="reviews-avg">
            {stats.total ? stats.avg.toFixed(1) : "—"} <i className="fa-solid fa-star" aria-hidden="true" />
          </span>
        </h2>

        <div className="rating-summary">
          {[5, 4, 3, 2, 1].map((star, index) => {
            const count = stats.buckets[index];
            const percent = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={star} className="rating-row">
                <span>{star}★</span>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${percent}%` }} />
                </div>
                <span>
                  {percent}% ({count})
                </span>
              </div>
            );
          })}
        </div>

        {!user ? (
          <p className="muted review-signin-hint">
            <Link to="/login" state={{ from: `/story-reviews/${id}` }}>Sign in</Link>{" "}
            to leave a review for this series.
          </p>
        ) : !isAuthor &&
          (editing ? (
            <div className="review-editor">
              <h3>Edit your review</h3>
              <ReviewForm
                initial={editing}
                submitLabel="Update review"
                busy={busy}
                onSubmit={handleSubmit}
              />
              <button type="button" className="btn btn-gray" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <ReviewForm
              initial={myReview}
              submitLabel={myReview ? "Update review" : "Submit review"}
              busy={busy}
              onSubmit={handleSubmit}
            />
          ))}

        <hr />
        <h2>Latest Reviews</h2>

        {loading ? (
          <p className="muted">Loading reviews…</p>
        ) : list.length === 0 ? (
          <EmptyState
            icon="fa-comment-dots"
            title="No reviews yet"
            message={isAuthor ? "Readers have not reviewed this series yet." : "Be the first to share your thoughts."}
          />
        ) : (
          <div className="review-list">
            {list.map((review) => {
              const liked = review.likedBy?.includes(user?.uid);
              const likeCount = review.likes || 0;
              const mine = review.userId === user?.uid;

              return (
                <article key={review.id} className="review-item">
                  <header>
                    <strong>{displayNameOf(users?.[review.userId])}</strong>{" "}
                    <span className="muted" title={review.createdAt}>
                      {timeAgo(review.createdAt)}
                    </span>
                    {mine && <span className="review-badge">Your review</span>}
                  </header>

                  <div className="review-topic">
                    <strong>Topic:</strong> {review.topic}
                  </div>

                  <p>{review.message}</p>

                  <footer>
                    <span className="review-rating">
                      {review.rating} <i className="fa-solid fa-star" aria-hidden="true" />
                    </span>

                    <button
                      type="button"
                      className={`like-btn ${liked ? "is-active" : ""}`}
                      onClick={() => handleLike(review)}
                      disabled={!user || busy}
                      aria-pressed={liked}
                      title={user ? "Like this review" : "Sign in to like reviews"}
                    >
                      <i className="fa-solid fa-heart" aria-hidden="true" /> {likeCount}
                    </button>

                    {mine && (
                      <button
                        type="button"
                        className="like-btn"
                        onClick={() => setEditingId(review.id === editingId ? null : review.id)}
                      >
                        <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Edit
                      </button>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
