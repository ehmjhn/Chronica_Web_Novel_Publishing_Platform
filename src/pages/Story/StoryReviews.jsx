import './story.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { retrieveUsers, readComic, retrieveReviews, addReview, updateReview } from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';
import StoryView from './StoryView';

function StoryReviews() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [allUsers, setAllUsers] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null);

    const [rating, setRating] = useState(0);
    const [reviewTopic, setReviewTopic] = useState('');
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        readComic((stories) => {
            const currentStory = stories.find((s) => s.id === id);
            setStory(currentStory);

            if (currentStory) {
                retrieveReviews((allReviews) => {
                    const storyReview = allReviews.filter((r) => r.storyId === currentStory.id);
                    setReviews(storyReview);
                });

                retrieveUsers((userData) => {
                    if (userData) setAllUsers(userData);
                });
            }
        });

        const unsubscribe = subscribeAuthChanges((currentUser) => {
            setCurrentUser(currentUser);
        });

        return () => unsubscribe();
    }, [id]);

    const userReview = currentUser ? reviews.find(r => r.userId === currentUser.uid) : null;

    useEffect(() => {
        if (userReview) {
            setRating(userReview.rating);
            setReviewTopic(userReview.topic);
            setReviewText(userReview.message);
        }
    }, [userReview]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) return alert("Please log in to submit a review.");
        if (!rating || !reviewTopic || !reviewText) return alert("Please fill all fields.");

        const reviewData = {
            storyId: story.id,
            userId: currentUser.uid,
            topic: reviewTopic,
            message: reviewText,
            rating,
            createdAt: new Date().toISOString(),
        };

        if (userReview) {
            updateReview(userReview.id, reviewData);
            alert("Your review has been updated!");
        } else {
            addReview(reviewData);
            alert("Review submitted!");
        }

        retrieveReviews(allReviews => {
            const storyReviews = allReviews.filter(r => r.storyId === story.id);
            setReviews(storyReviews);
        });
    }

    function handleLikeToggle(review) {
        if (!currentUser) return alert("Please log in to like reviews.");

        const likedBy = review.likedBy || [];
        const hasLiked = likedBy.includes(currentUser.uid);

        const newLikedBy = hasLiked
            ? likedBy.filter(id => id !== currentUser.uid)
            : [...likedBy, currentUser.uid];

        const updatedReview = {
            ...review,
            likedBy: newLikedBy,
            likes: newLikedBy.length
        };

        updateReview(review.id, updatedReview);
        setReviews(prev => prev.map(r => r.id === review.id ? updatedReview : r));
    }

    const totalReviews = reviews.length;
    const starCounts = [5, 4, 3, 2, 1].map(star => reviews.filter(r => r.rating === star).length);
    const starPercentages = starCounts.map(count => totalReviews ? Math.round((count / totalReviews) * 100) : 0);
    const avgRating = totalReviews ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 0;

    if (!story) return <div className="homepage"><div style={{ margin: "0 auto", fontSize: "20px", color: "white" }}>Loading...</div></div>;

    return (
        <div className="storyview-page">
            <StoryView />

            <div className="reviews-container">
                <h2>
                    Reviews ({totalReviews}) —{" "}
                    <span style={{ color: "#f5c518" }}>
                        {avgRating} <i className="fa-solid fa-star"></i>
                    </span>
                </h2>

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

                <div className="write-review">
                    <h3>{userReview ? "Edit Your Review" : "Write a Review"}</h3>

                    <form onSubmit={handleSubmit}>
                        <label>Your Rating:</label>
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
                            <i className="fa-solid fa-paper-plane"></i>{" "}
                            {userReview ? "Update Review" : "Submit Review"}
                        </button>
                    </form>
                </div>

                <hr />

                <div className="review-list">
                    {reviews.map((review) => {
                        const reviewer = allUsers.find(u => u.id === review.userId);

                        return (
                            <div key={review?.id} className="review-item">
                                <div>
                                    <strong>{reviewer?.displayName}</strong>{" "}
                                    <span>{new Date(review?.createdAt).toLocaleString()}</span>
                                </div>
                                <div>
                                    <strong>Review Topic:</strong> {review?.topic}
                                </div>
                                <p>{review?.message}</p>
                                <div>
                                    Rating:{" "}
                                    <span style={{ color: "#f5c518" }}>
                                        {review?.rating} <i className="fa-solid fa-star"></i>
                                    </span>{" "}
                                    |   <span
                                            onClick={() => handleLikeToggle(review)}
                                            style={{
                                                color: review.likedBy?.includes(currentUser.uid) ? "red" : "gray",
                                                cursor: "pointer",
                                                userSelect: "none"
                                            }}
                                        >
                                            <i className="fa-solid fa-heart"></i> {review.likes || 0}
                                        </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default StoryReviews;
