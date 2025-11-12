import { useState, useEffect } from "react";
import "./story.css";
import { NavLink } from "react-router";
import { subscribeAuthChanges } from "../../firebase/auth";
import { getUserStories } from "../../firebase/db";

function MySeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthChanges((currentUser) => {
      if (currentUser) {
        getUserStories(currentUser.uid, (stories) => {
          setSeriesList(stories);
          setLoading(false);
        });
      } else {
        setSeriesList([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading)
    return (
      <div style={{ margin: "0 auto", fontSize: "20px", color: "white" }}>
        Loading...
      </div>
    );
  if (seriesList.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        No series has been created yet.
      </div>
    );

  // pagination
  const totalPages = Math.ceil(seriesList.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = seriesList.slice(startIndex, startIndex + limit);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handleBack = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to='/home'>
          <i className="fa-solid fa-home"></i>
        </NavLink>{" "}
        / <NavLink to='/my-series'>My Series</NavLink>
      </div>

      <div className="series-page">
        <div className="series-header">
          <h2>My Series ({seriesList.length})</h2>
          <NavLink to='/create-story' className="add-series-btn">
            <i className="fa-solid fa-plus"></i> Add series
          </NavLink>
        </div>

        <div className="filter-section">
          <span>Show per page: </span>
          <select id="limit" value={limit} onChange={handleLimitChange}>
            {[10, 25, 50, 75, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="series-list">
          {paginatedData.map((s) => (
            <div key={s.id} className="series-card">
              <img
                src={s.coverImage || "https://via.placeholder.com/120x150"}
                alt={s.title}
                className="series-img"
              />
              <div className="series-info">
                <h3 className="series-title">{s.title}</h3>
                <span className="series-genre">{s.genre}</span>
                <p className="series-desc">{s.synopsis}</p>
                <span className="series-meta">
                  <i className="fa-solid fa-eye"></i> {s.views || 0} |{" "}
                  <i className="fa-solid fa-book"></i> {s.totalChapters || 0}{" "}
                  Chapters | <i className="fa-solid fa-heart"></i>{" "}
                  {s.likes || 0} Favorites
                </span>

                <div className="series-buttons">
                  <NavLink to='/create-chapter' className="btn-yellow">
                    <i className="fa-solid fa-plus"></i> Add chapter
                  </NavLink>
                  <NavLink to='/update-story' className="btn-yellow">
                    <i className="fa-solid fa-pen"></i> Update
                  </NavLink>
                </div>
              </div>
              <button className="delete-btn">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        {/* PAGINATION: always visible */}
        <div className="pagination">
          <button
            onClick={handleBack}
            disabled={currentPage === 1}
            className="page-btn"
          >
            <i className="fa-solid fa-angle-left"></i> Back
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MySeries;
