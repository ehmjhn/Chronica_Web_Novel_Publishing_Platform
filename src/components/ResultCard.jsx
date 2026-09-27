import "./components.css";
import { Link } from "react-router";
import { formatNumber } from "../lib/format";
import { PLACEHOLDER_COVER } from "../lib/constants.js";

/**
 * Horizontal story result used by Search and the Reading List.
 *
 * Note the field names: stories store their categories under `genre` (a list)
 * and `tags`. The previous version read a non-existent `genres` key, so genre
 * chips never rendered, and `rate` was passed straight into toFixed() which
 * threw on new stories where rate was undefined.
 */
function ResultCard({
  id,
  title,
  coverImage,
  rate,
  status,
  genre = [],
  tags = [],
  synopsis,
  views,
  chapters,
  likes,
  removable = false,
  busy = false,
  onRemove,
}) {
  const rating = Number(rate) || 0;
  const genres = Array.isArray(genre) ? genre : [];

  return (
    <div className="result-card-wrap">
      <Link to={`/story-details/${id}`} className="result-link">
        <div className="result-card">
          <img
            src={coverImage || PLACEHOLDER_COVER}
            alt=""
            className="result-cover"
            loading="lazy"
          />

          <div className="result-details">
            <h3 className="result-title">{title || "Untitled"}</h3>

            <div className="result-meta">
              {status && (
                <span className="result-status">
                  <i className="fa-solid fa-book-open" aria-hidden="true" /> {status}
                </span>
              )}
              <span className="result-rate">
                <i className="fa-solid fa-star" aria-hidden="true" /> {rating ? rating.toFixed(1) : "—"}
              </span>
            </div>

            {synopsis && <p className="result-summary">{synopsis}</p>}

            {(genres.length > 0 || tags.length > 0) && (
              <div className="result-tags">
                {genres.map((item) => (
                  <span key={`genre-${item}`} className="genre-tag">
                    {item}
                  </span>
                ))}
                {tags.map((item) => (
                  <span key={`tag-${item}`} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="result-stats">
              <span>
                <i className="fa-solid fa-eye" aria-hidden="true" /> {formatNumber(views)}
              </span>
              <span>
                <i className="fa-solid fa-list" aria-hidden="true" /> {chapters ?? 0} ch
              </span>
              <span>
                <i className="fa-solid fa-heart" aria-hidden="true" /> {formatNumber(likes)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {removable && onRemove && (
        <div className="result-actions">
          <button
            type="button"
            className="remove-btn"
            onClick={(event) => {
              // The card is wrapped in a Link, so without this the click would
              // navigate to the story instead of removing the bookmark.
              event.preventDefault();
              event.stopPropagation();
              onRemove(id);
            }}
            disabled={busy}
            aria-label={`Remove ${title || "this series"} from your list`}
          >
            <i className="fa-solid fa-trash" aria-hidden="true" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultCard;
