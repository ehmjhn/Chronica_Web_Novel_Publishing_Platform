import './story.css';
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
// import { db } from "./firebase";

function StoryReviews() {
  const [rating, setRating] = useState(7);
  const [reviewTopic, setReviewTopic] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTopic || !reviewText) return; 

    const newReview = {
      user: "Anonymous",
      date: Timestamp.fromDate(new Date()),
      topic: reviewTopic,
      text: reviewText,
      score: rating,
      likes: 0,
    };

    try {
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]);
      setReviewTopic("");
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="reviews-container">
      <h2>Reviews ({reviews.length})</h2>

      {/* Rating Summary */}
      <div className="rating-summary">
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star}>{star} stars: 0% (0)</div>
        ))}
      </div>

      {/* Write a Review */}
      <div className="write-review">
        <h3>Write a Review</h3>
        <form onSubmit={handleSubmit}>
          <label>Your Rating: ({rating})</label>
          <div className="stars">
            {[...Array(10)].map((_, i) => (
                <span
                key={i}
                style={{ cursor: "pointer", color: i < rating ? "orange" : "gray" }}
                onClick={() => setRating(i + 1)}
                >
                ★
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
          <button type="submit">Submit</button>
        </form>
      </div>

        <hr />

      {/* Reviews List */}
      <div className="review-list">
        {reviews.map(review => (
            <div key={review.id} className="review-item">
            <div>
              <strong>{review.user}</strong> <span>{review.date.toDate ? review.date.toDate().toLocaleDateString() : review.date}</span>
            </div>
            <div><strong>Review Topic:</strong> {review.topic}</div>
            <p>{review.text}</p>
            <div>Rating: {review.score} / 10 | {review.likes} likes</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryReviews;
