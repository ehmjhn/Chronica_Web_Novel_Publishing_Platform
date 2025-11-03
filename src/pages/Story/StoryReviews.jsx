import './story.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { readComic } from '../../firebase/db';
import StoryView from './StoryView';

function StoryReviews() {
  const [rating, setRating] = useState(0);
  const [reviewTopic, setReviewTopic] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [viewStory, setView] = useState([]);

  // sample data
  useEffect(() => {
    readComic(setView);

    const dummyReviews = [
      {
        id: 1,
        user: "John Doe",
        date: "2025-10-30",
        topic: "Great Story!",
        text: "Really loved the pacing and plot twists. Waiting for more!",
        score: 5,
        likes: 12,
      },
      {
        id: 2,
        user: "Luna Sky",
        date: "2025-10-25",
        topic: "Nice Character Development",
        text: "Characters felt realistic and relatable!",
        score: 4,
        likes: 5,
      },
      {
        id: 3,
        user: "Alex Moon",
        date: "2025-10-22",
        topic: "Could be better",
        text: "Story started strong but pacing slowed a bit in the middle.",
        score: 3,
        likes: 2,
      },
    ];
    setReviews(dummyReviews);
  }, []);

  // handle adding a new review
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewTopic || !reviewText) return;

    const newReview = {
      id: Date.now(),
      user: "Anonymous",
      date: new Date().toLocaleDateString(),
      topic: reviewTopic,
      text: reviewText,
      score: rating,
      likes: 0,
    };

    setReviews([newReview, ...reviews]);
    setReviewTopic("");
    setReviewText("");
    setRating(0);
  };

  // calculate bar stats
  const totalReviews = reviews.length;
  const starCounts = [5, 4, 3, 2, 1].map((star) =>
    reviews.filter((r) => r.score === star).length
  );
  const starPercentages = starCounts.map((count) =>
    totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
  );

  // compute average
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + r.score, 0) / totalReviews
        ).toFixed(1)
      : 0;

  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story) => (
          <div key={story.id} className="storyview-page">
            
            <StoryView />

            <div className="reviews-container">
              <h2>
                Reviews ({totalReviews}) — {" "}
                <span style={{ color: "#f5c518" }}>
                  {avgRating} <i className="fa-solid fa-star"></i>
                </span>
              </h2>

              {/* Rating Summary */}
              <div className="rating-summary">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="rating-row">
                    <span>{star}★:</span>
                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{ width: `${starPercentages[i]}%` }}
                      ></div>
                    </div>
                    <span>
                      {starPercentages[i]}% ({starCounts[i]})
                    </span>
                  </div>
                ))}
              </div>

              {/* Write a Review */}
              <div className="write-review">
                <h3>Write a Review</h3>
                <form onSubmit={handleSubmit}>
                  <label>Your Rating: ({rating})</label>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= rating ? "active" : ""}`}
                        onClick={() => setRating(star)}
                      >
                        <i className="fa-solid fa-star"></i>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Review Topic"
                    value={reviewTopic}
                    onChange={(e) => setReviewTopic(e.target.value)}
                  />

                  <textarea
                    placeholder="Your Review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />

                  <button type="submit">
                    <i className="fa-solid fa-paper-plane"></i> Submit
                  </button>
                </form>
              </div>

              <hr />

              {/* Reviews List */}
              <div className="review-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div>
                      <strong>{review.user}</strong>{" "}
                      <span>{review.date}</span>
                    </div>
                    <div>
                      <strong>Review Topic:</strong> {review.topic}
                    </div>
                    <p>{review.text}</p>
                    <div>
                      Rating:{" "}
                      <span style={{ color: "#f5c518" }}>
                        {review.score} <i className="fa-solid fa-star"></i>
                      </span>{" "}
                      | <i className="fa-solid fa-heart"></i> {review.likes} likes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default StoryReviews;