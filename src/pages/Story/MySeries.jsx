import { useState } from "react";
import "./story.css";
import { NavLink } from "react-router";

function MySeries() {
  // sample data
  const dummySeries = [
    {
        id: 1,
        title: "The Golden Chronicle",
        genre: "Fantasy",
        desc: "A young hero embarks on a quest to reclaim a lost kingdom.",
        views: 856,
        favorites: 1081,
        chapters: 12,
        cover: "https://via.placeholder.com/120x150?text=Golden+Chronicle"
    },
    {
        id: 2,
        title: "Cyber Nexus",
        genre: "Sci-Fi",
        desc: "In a futuristic world, hackers battle for digital supremacy.",
        views: 1342,
        favorites: 1081,
        chapters: 18,
        cover: "https://via.placeholder.com/120x150?text=Cyber+Nexus"
    },
    {
        id: 3,
        title: "Love & Stardust",
        genre: "Romance",
        desc: "Two souls find love among the stars and cosmic dust.",
        views: 923,
        favorites: 1081,
        chapters: 9,
        cover: "https://via.placeholder.com/120x150?text=Love+%26+Stardust"
    },
    {
        id: 4,
        title: "The Shadow Blade",
        genre: "Action",
        desc: "An assassin seeks redemption through one final mission.",
        views: 1104,
        favorites: 1081,
        chapters: 14,
        cover: "https://via.placeholder.com/120x150?text=Shadow+Blade"
    },
    {
        id: 5,
        title: "Echoes of Time",
        genre: "Adventure",
        desc: "A time traveler faces the consequences of changing fate.",
        views: 789,
        favorites: 1081,
        chapters: 11,
        cover: "https://via.placeholder.com/120x150?text=Echoes+of+Time"
    },
    {
        id: 6,
        title: "Mystic Academy",
        genre: "Fantasy",
        desc: "Students train to master elemental powers at a secret academy.",
        views: 1520,
        favorites: 1081,
        chapters: 20,
        cover: "https://via.placeholder.com/120x150?text=Mystic+Academy"
    },
    {
        id: 7,
        title: "Neon City Nights",
        genre: "Thriller",
        desc: "Detectives uncover a conspiracy in the heart of Neon City.",
        views: 674,
        chapters: 10,
        cover: "https://via.placeholder.com/120x150?text=Neon+City+Nights"
    },
    {
        id: 8,
        title: "Beyond the Horizon",
        genre: "Adventure",
        desc: "A daring voyage into uncharted seas reveals ancient secrets.",
        views: 912,
        favorites: 1081,
        chapters: 13,
        cover: "https://via.placeholder.com/120x150?text=Beyond+the+Horizon"
    },
    {
        id: 9,
        title: "Celestial Bond",
        genre: "Romance",
        desc: "A forbidden love between a mortal and a celestial being.",
        views: 1005,
        favorites: 1081,
        chapters: 16,
        cover: "https://via.placeholder.com/120x150?text=Celestial+Bond"
    },
    {
        id: 10,
        title: "Iron Vanguard",
        genre: "Action",
        desc: "Elite soldiers fight to defend humanity from alien invaders.",
        views: 1278,
        favorites: 1081,
        chapters: 15,
        cover: "https://via.placeholder.com/120x150?text=Iron+Vanguard"
    },
    {
        id: 11,
        title: "Whispers of the Forest",
        genre: "Mystery",
        desc: "A girl unravels the ancient legends hidden within her homeland.",
        views: 532,
        favorites: 1081,
        chapters: 8,
        cover: "https://via.placeholder.com/120x150?text=Whispers+of+the+Forest"
    },
    {
        id: 12,
        title: "Digital Heartbeat",
        genre: "Sci-Fi",
        desc: "An AI develops emotions after bonding with its creator.",
        views: 1467,
        favorites: 1081,
        chapters: 19,
        cover: "https://via.placeholder.com/120x150?text=Digital+Heartbeat"
    }
    ];


  // page
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // page math
  const totalPages = Math.ceil(dummySeries.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = dummySeries.slice(startIndex, startIndex + limit);

  // handlers
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <NavLink to='/my-series'>My Series</NavLink>
      </div>
      <div className="series-page">
        {/* HEADER */}
        <div className="series-header">
          <h2>My Series ({dummySeries.length})</h2>
          <NavLink to='/create-story' className="add-series-btn">
            <i className="fa-solid fa-plus"></i> Add series
          </NavLink>
        </div>

        {/* FILTER */}
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

        {/* SERIES LIST */}
        <div className="series-list">
          {paginatedData.map((s) => (
            <div key={s.id} className="series-card">
              <img src={s.cover} alt={s.title} className="series-img" />
              <div className="series-info">
                <h3 className="series-title">{s.title}</h3>
                <span className="series-genre">{s.genre}</span>
                <p className="series-desc">{s.desc}</p>
                <span className="series-meta">
                  <i className="fa-solid fa-eye"></i> {s.views} | {" "}
                  <i className="fa-solid fa-book"></i> {s.chapters} Chapters | {" "}
                  <i className="fa-solid fa-heart"></i> {s.favorites} Favorites 
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

        {/* PAGINATION */}
        <div className="pagination">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="page-buttons">
            <button
              onClick={handleBack}
              disabled={currentPage === 1}
              className="page-btn"
            >
              <i className="fa-solid fa-angle-left"></i> Back
            </button>
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
    </div>
  );
}

export default MySeries;
