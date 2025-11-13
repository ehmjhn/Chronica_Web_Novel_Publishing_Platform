import "./components.css";
import { NavLink } from "react-router-dom";

function ResultCard({
  id,
  title,
  cover,
  rate,
  status,
  genre = [],
  tags = [],
  synopsis,
  views,
  chapters,
  likes,
  isBookmark = false,
  onRemove 
}) {

  return (
    <NavLink to={`/story-details/${id}`} className="result-link">
      <div className="result-card">
        <img src={cover} alt={title} className="result-cover" />

        <div className="result-details">
          <h3 className="result-title">{title}</h3>

          <div className="result-meta">
            <span className="result-status"><i className="fa-solid fa-book-open"></i> {status}</span>
            <span className="result-rate"><i className="fa-solid fa-star"></i> {rate?.toFixed(1)}</span>
          </div>

          <p className="result-summary">{synopsis}</p>

          <div className="result-tags">
            {genre.map((genre, i) => (
              <span key={`genre-${i}`} className="genre-tag">{genre}</span>
            ))}

            {tags.map((tag, i) => (
              <span key={`tag-${i}`} className="tag">{tag}</span>
            ))}
          </div>

          <div className="result-stats">
            <span><i className="fa-solid fa-eye"></i> {views}</span>
            <span><i className="fa-solid fa-list"></i> {chapters} ch</span>
            <span><i className="fa-solid fa-heart"></i> {likes}</span>
          </div>
        </div>

        {isBookmark && onRemove && (
          <div className="result-actions">
            <button
              className="remove-btn"
              onClick={(e) => {
                e.preventDefault(); // prevent navigating to story when removing
                onRemove(id);
              }}
            >
              <i className="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        )}
      </div>
    </NavLink>
  );
}

export default ResultCard;
