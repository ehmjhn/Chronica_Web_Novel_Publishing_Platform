import "./components.css";
import { NavLink } from "react-router-dom";

function ResultCard({ id, title, cover, rate, status, genres, tags, summary, views, chapters, favorites, isBookmark = false, onRemove }) {

  return (
    <NavLink to={`/story/${id}`} className="result-link">
      <div className="result-card">
        <img src={cover} alt={title} className="result-cover" />

        <div className="result-details">
          <h3 className="result-title">{title}</h3>

          <div className="result-meta">
            <span className="result-status"><i className="fa-solid fa-book-open"></i> {status}</span>
            <span className="result-rate"><i className="fa-solid fa-star"></i> {rate.toFixed(1)}</span>
          </div>

          <p className="result-summary">{summary}</p>

          <div className="result-tags">
            {[...genres, ...tags].map((tag, i) => (
              <span key={i} className={`tag ${genres.includes(tag) ? "genre-tag" : ""}`}>{tag}</span>
            ))}
          </div>

          <div className="result-stats">
            <span><i className="fa-solid fa-eye"></i> {views}</span>
            <span><i className="fa-solid fa-list"></i> {chapters} ch</span>
            <span><i className="fa-solid fa-heart"></i> {favorites}</span>
          </div>
        </div>
        {isBookmark && (
            <div className="result-actions">
            <button className="remove-btn" onClick={() => onRemove?.(id)}>
                <i className="fa-solid fa-trash"></i> Remove
            </button>
            </div>
        )}
      </div>
    </NavLink>
  );
}

export default ResultCard;
