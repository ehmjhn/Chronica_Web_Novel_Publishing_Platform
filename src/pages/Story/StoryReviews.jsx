import './story.css';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { retrieveUsers, readComic, retrieveReviews, addReview } from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';
import StoryView from './StoryView';

function StoryReviews() {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [allUsers, setAllUsers] = useState([]) 
    const [currentUser, setCurrentUser] = useState(null) 

    // New review form states
    const [rating, setRating] = useState(0);
    const [reviewTopic, setReviewTopic] = useState('');
    const [reviewText, setReviewText] = useState('');

    // Fetch story and reviews
    useEffect(() => {

        readComic((stories) => {
        const currentStory = stories.find((s) => s.id === id);
        setStory(currentStory);

        if (currentStory) {
            retrieveReviews((allReviews) => {
            const storyReview = allReviews.filter((r) => r.storyId === currentStory.id);
            setReviews(storyReview);
            });

            retrieveUsers((userData)=>{
                if(userData){
                setAllUsers(userData)
                }
            });
        }
        });

        const unsubscribe = subscribeAuthChanges((currentUser)=>{
            setCurrentUser(currentUser)
        })

        return ()=> unsubscribe()

    }, [id]);

    // Handle adding a new review
    const userReview = currentUser
    ? reviews.find(r => r.userId === currentUser.uid)
    : null;

    // handleSubmit
    const handleSubmit = (e) => {
    e.preventDefault();
        if (!currentUser) return alert("Please log in to submit a review.");
        if (userReview) return alert("You have already reviewed this story.");
        if (!rating || !reviewTopic || !reviewText) return alert("Please fill all fields");

        const reviewId = `review_${Date.now()}`;
        const newReview = {
            id: reviewId,
            storyId: story.id,
            userId: currentUser.uid,
            topic: reviewTopic,
            message: reviewText,
            rating,
            createdAt: new Date().toISOString(),
            likes: 0
        };

        addReview(newReview, () => {
            setRating(0);
            setReviewTopic('');
            setReviewText('');
        }); 
    };


    // Rating summary
    const totalReviews = reviews.length;
    const starCounts = [5, 4, 3, 2, 1].map((star) =>
        reviews.filter((r) => r.rating === star).length
    );
    const starPercentages = starCounts.map((count) =>
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    );

    // Average rating
    const avgRating =
    totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

    if (!story) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

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

                {userReview ? (
                    <div className="review-item">
                    <div>
                        <strong>{currentUser?.name}</strong>{" "}
                        <span>{new Date(userReview.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                        <strong>Review Topic:</strong> {userReview?.topic}
                    </div>
                    <p>{userReview?.message}</p>
                    <div>
                        Rating:{" "}
                        <span style={{ color: "#f5c518" }}>
                        {userReview?.rating} <i className="fa-solid fa-star"></i>
                        </span>
                    </div>
                    </div>
                ) : (
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
                        <i className="fa-solid fa-paper-plane"></i> Submit
                    </button>
                    </form>
                )}
                </div>

                <hr />

                {/* Reviews List */}
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
                        | <i className="fa-solid fa-heart"></i> {review?.likes} likes
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
