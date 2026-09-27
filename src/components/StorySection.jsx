import { NavLink } from "react-router";
import StoryCard from "./StoryCard";
import "./components.css";

/**
 * `stories` must already carry `authorName` (see useStoriesWithAuthors) — this
 * component used to fire one getUserProfile() read per card on every render.
 */
function StorySection({ title, stories = [], viewAllPath, showFeaturedBadge = false, emptyMessage }) {
  const visible = stories.slice(0, 5);

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
        {visible.length > 0 ? (
          visible.map((story) => (
            <StoryCard
              key={story.id}
              storyId={story.id}
              title={story.title}
              author={story.authorName}
              views={story.views}
              rate={story.rate}
              coverImage={story.coverImage}
              isFeatured={story.isFeatured}
              showFeatured={showFeaturedBadge && story.isFeatured}
            />
          ))
        ) : (
          <div className="no-stories">
            <p>{emptyMessage || "No stories available at the moment."}</p>
            {viewAllPath && (
              <NavLink to={viewAllPath} className="view-all-link">
                Browse the catalogue →
              </NavLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default StorySection;
