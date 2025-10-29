import React from 'react';
import './story-card.css';

const StoryCard = ({ story, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(story);
    }
  };

  return (
    <div className="story-card" onClick={handleClick}>
      <div 
        className="story-card-image"
        style={{
          backgroundImage: story.coverImage 
            ? `url(${story.coverImage})` 
            : undefined
        }}
      >
        {story.isFeatured && (
          <span className="story-badge">Featured</span>
        )}
      </div>
      
      <div className="story-card-content">
        <h3 className="story-title">{story.title}</h3>
        <p className="story-author">by {story.author}</p>
        
        <div className="story-stats">
          <span className="stat">
            {/*Icon here */ }
            <span>{story.views}</span>
          </span>
          <span className="stat">
            {/*Icon here */}
            <span>{story.comments}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;