import React from 'react';
import './story-card.css';

import { NavLink } from 'react-router';

function StoryCard({ storyId, title, author, coverImage, views, rate, isFeatured, showFeatured }) {

  return (
    <NavLink to={`/story/${storyId}`} className="story-card">
      <div
        className="story-card-image"
        style={{
          backgroundImage: coverImage ? `url(${coverImage})` : undefined,
        }}
      >
        {isFeatured && showFeatured && <span className="story-badge">Featured</span>}
      </div>

      <div className="story-card-content">
        <h3 className="story-title">{title}</h3>
        <p className="story-author">by {author}</p>

        <div className="story-stats">
          <span className="stat">
            <span><i className="fa-solid fa-eye"></i> {views}</span>
          </span>
          <span className="stat">
            <span><i className="fa-solid fa-star"></i> {rate}</span>
          </span>
        </div>
      </div>
    </NavLink>
  );
}

export default StoryCard;