import "./components.css";
import { NavLink } from "react-router";
import { formatNumber } from "../lib/format";
import { PLACEHOLDER_COVER } from "../lib/constants.js";

function StoryCard({ storyId, title, author, coverImage, views, rate, isFeatured, showFeatured }) {
  const cover = coverImage || PLACEHOLDER_COVER;
  const rating = Number(rate) || 0;

  return (
    <NavLink to={`/story-details/${storyId}`} className="story-card">
      <div className="story-card-image" style={{ backgroundImage: `url("${cover}")` }}>
        {isFeatured && showFeatured && <span className="story-badge">Featured</span>}
      </div>

      <div className="story-card-content">
        <h3 className="story-title">{title || "Untitled"}</h3>
        <p className="story-author">by {author || "Unknown"}</p>

        <div className="story-stats">
          <span className="stat">
            <span>
              <i className="fa-solid fa-eye" aria-hidden="true" /> {formatNumber(views)}
            </span>
          </span>
          <span className="stat">
            <span>
              <i className="fa-solid fa-star" aria-hidden="true" /> {rating ? rating.toFixed(1) : "—"}
            </span>
          </span>
        </div>
      </div>
    </NavLink>
  );
}

export default StoryCard;
