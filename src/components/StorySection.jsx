import { NavLink } from 'react-router-dom';
import StoryCard from './StoryCard.jsx';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../firebase/db';
import './components.css';

function StorySection({ title, stories, viewAllPath, showFeaturedBadge = false }) {

  const [authors, setAuthors] = useState({}); 

  useEffect(() => {
    stories.forEach((story) => {
      if (story.authorId && !authors[story.id]) {
        getUserProfile(story.authorId).then((userData) => {
          setAuthors((prev) => ({ ...prev, [story.id]: userData }));
        });
      }
    });
  }, [stories]);

  return (
    <section className="story-section">
      <div className="story-section-header">
        <h2 className="story-section-title">{title}</h2>
        {viewAllPath && (
          <NavLink to={viewAllPath} className="view-all-link">
            View All →
          </NavLink>
        )}
      </div>

      <div className="story-grid">
        {stories && stories.length > 0 ? (
          stories.map((story, index) => {
            const authorInfo = authors[story.id];

            return (
              <StoryCard
                key={index}
                storyId={story.id}
                title={story.title}
                author={authorInfo ? authorInfo.displayName : '--'}
                views={story.views}
                rate={story.rate}
                coverImage={story.coverImage}
                isFeatured={story.isFeatured}
                showFeatured={showFeaturedBadge && story.isFeatured}
              />
            );
          })
        ) : (
          <div className="no-stories">
            <p>No stories available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default StorySection;
