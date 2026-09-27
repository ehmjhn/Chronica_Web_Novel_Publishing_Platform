import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { formatNumber } from "../../lib/format";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useStoryChapters } from "../../hooks/useChapters";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useToast } from "../../components/toast-context";
import { getStory, updateBookmark, updateStoryLikes, updateStoryViews } from "../../firebase/db";
import "./story.css";

/**
 * Story header shared by the overview, chapter-list and reviews pages.
 *
 * The previous version called readComic() from *inside* the auth-state
 * callback, so every auth change stacked another orphaned listener. Here each
 * subscription is created once at the top level and torn down on unmount.
 */
export default function StoryView() {
  const { id } = useParams();
  const { user, profile } = useAuthUser();
  const toast = useToast();

  const { data: story, loading } = useAsyncData(() => getStory(id), [id]);
  const { chapters } = useStoryChapters(id);

  const [likesCount, setLikesCount] = useState(0);
  const [localViews, setLocalViews] = useState(null);
  const [pending, setPending] = useState(false);

  // `profile` and `story` are one-shot fetches, so deriving the button state
  // from them left the heart and bookmark looking untouched after a click.
  // Seed once from the server, then keep the truth in local state.
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLikesCount(story?.likes || 0);
    setLiked(Boolean(story?.likedBy?.includes(user?.uid)));
    setLocalViews(null);
  }, [story?.id, story?.likes, story?.likedBy, user?.uid]);

  useEffect(() => {
    setBookmarked(Boolean(profile?.bookmarkedStories?.includes(id)));
  }, [profile?.bookmarkedStories, id]);

  const isOwner = Boolean(user && story && user.uid === story.authorId);

  // Narrow the story to the two fields the view counter needs, so this effect
  // re-runs when the series or its author changes but not on every refetch.
  const storyId = story?.id;
  const storyAuthorId = story?.authorId;

  // Count one view per reader per series, and only for signed-in non-authors.
  useEffect(() => {
    if (!user || !storyId || user.uid === storyAuthorId) return undefined;

    let active = true;
    updateStoryViews(storyId, user.uid, storyAuthorId)
      .then((views) => {
        if (active && views != null) setLocalViews(views);
      })
      .catch(() => {
        // A failed view count is not worth interrupting the reader over.
      });
    return () => {
      active = false;
    };
  }, [user, storyId, storyAuthorId]);

  async function handleBookmark() {
    if (!user) {
      toast.info("Please sign in to build a reading list.");
      return;
    }
    if (!story || pending) return;

    const next = !bookmarked;
    setPending(true);
    setBookmarked(next); // optimistic

    try {
      const result = await updateBookmark(user.uid, story.id);
      setBookmarked(result.isBookmarked);
      toast.success(result.isBookmarked ? "Added to your reading list." : "Removed from your reading list.");
    } catch (err) {
      setBookmarked(!next); // roll back
      toast.error(err.message);
    } finally {
      setPending(false);
    }
  }

  async function handleLike() {
    if (!user) {
      toast.info("Please sign in to favourite stories.");
      return;
    }
    if (!story || pending) return;

    const next = !liked;
    setPending(true);
    setLiked(next);
    setLikesCount((count) => Math.max(0, count + (next ? 1 : -1)));

    try {
      const result = await updateStoryLikes(story.id, user.uid, next);
      setLikesCount(result.likes);
      setLiked(result.hasLiked);
    } catch (err) {
      setLiked(!next);
      setLikesCount(story.likes || 0);
      toast.error(err.message);
    } finally {
      setPending(false);
    }
  }

  const firstChapter = chapters[0];
  const rating = Number(story?.rate) || 0;
  const views = localViews ?? story?.views ?? 0;

  return (
    <>
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <span>Series</span> / <i>{story?.title || "…"}</i>
      </div>

      <div className="storyview-hero">
        <div className="storyview-wrapper">
          {story?.coverImage && (
            <img src={story.coverImage} alt={`Cover of ${story.title}`} className="storyview-cover" />
          )}

          <div className="storyview-hero-info">
            <h1>{loading ? "Loading…" : story?.title || "Story not found"}</h1>

            {story && (
              <p className="meta">
                <i className="fa-solid fa-book-open" aria-hidden="true" /> {story.status} &nbsp;•&nbsp;
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={pending}
                  className={`meta-action ${liked ? "is-active" : ""}`}
                  aria-pressed={liked}
                  title={liked ? "Remove from favourites" : "Add to favourites"}
                >
                  <i className="fa-solid fa-heart" aria-hidden="true" /> {formatNumber(likesCount)}
                </button>
                &nbsp;•&nbsp;
                <i className="fa-solid fa-list" aria-hidden="true" /> {chapters.length}
              </p>
            )}

            {story && (
              <div className="storyview-rating">
                <span>
                  <i className="fa-solid fa-star star-icon" aria-hidden="true" />{" "}
                  {rating ? rating.toFixed(1) : "—"}
                </span>
                <span>
                  <i className="fa-solid fa-eye view-icon" aria-hidden="true" /> {formatNumber(views)} views
                </span>
              </div>
            )}

            <div className="storyview-buttons">
              {firstChapter ? (
                <Link to={`/read-chapter/${firstChapter.id}`} className="btn read">
                  <i className="fa-solid fa-book-open" aria-hidden="true" /> Read
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn read"
                  disabled
                  title={isOwner ? "Add your first chapter to start reading" : "No chapters published yet"}
                >
                  <i className="fa-solid fa-book-open" aria-hidden="true" /> No chapters yet
                </button>
              )}

              <button
                type="button"
                className={`btn download ${bookmarked ? "bookmarked" : ""}`}
                onClick={handleBookmark}
                disabled={pending}
                aria-pressed={bookmarked}
              >
                <i className="fa-solid fa-bookmark" aria-hidden="true" />{" "}
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        </div>

        <nav className="storyview-nav">
          <Link to={`/story-details/${id}`}>Overview</Link>
          <Link to={`/story-chapter-list/${id}`}>Chapter List</Link>
          <Link to={`/story-reviews/${id}`}>Reviews</Link>
        </nav>
      </div>
    </>
  );
}
