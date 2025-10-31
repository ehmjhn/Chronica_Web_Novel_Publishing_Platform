import { NavLink } from 'react-router-dom';
import '../pages/Story/story.css'

function StoryHeroNav() {
  return (
    <div className="storyview-hero">

      {/* HERO */}
      <div className="storyview-wrapper">
        <img
          src="https://fantasy-faction.com/wp-content/uploads/2025/01/image-2.jpeg"
          alt="Cover"
          className="storyview-cover"
        />

        <div className="storyview-hero-info">
          <h1>Hindi ko Alam ang Title</h1>
          <p className="meta">100% • Favorites • Chapters</p>

          <div className="storyview-rating">
            <i className="fa fa-star star-icon"></i>
            <span>9.5/10 (732 ratings)</span>
          </div>

          <div className="storyview-buttons">
            <button className="btn read">Read</button>
            <button className="btn download">Download</button>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className="storyview-nav">
        <NavLink to="/story-view" end className={({ isActive }) => isActive ? "active" : ""}>
          Overview
        </NavLink>
        <NavLink to="/story-view/chapters" className={({ isActive }) => isActive ? "active" : ""}>
          Chapter List
        </NavLink>
        <NavLink to="/story-view/reviews" className={({ isActive }) => isActive ? "active" : ""}>
          Reviews
        </NavLink>
      </div>

    </div>
  );
}

export default StoryHeroNav;
