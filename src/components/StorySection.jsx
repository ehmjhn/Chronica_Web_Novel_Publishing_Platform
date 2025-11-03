import { NavLink } from 'react-router-dom';
import StoryCard from './StoryCard.jsx';
import './components.css';

function StorySection({ title, stories, viewAllPath, showFeaturedBadge = false }) {

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
          stories.map((story, index) => (
           
            <StoryCard 
              key={story.id || index}
              storyId={story.id}
              title={story.title}
              author={story.author}
              views={story.views}
              rate={story.rating}
              coverImage={story.coverImage}
              isFeatured={story.isFeatured}
              showFeatured={showFeaturedBadge && story.isFeatured}
            />
          ))
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
