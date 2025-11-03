import "./reader.css";
import { useState } from "react";
import { NavLink } from "react-router";
import ResultCard from "../../components/ResultCard";

function SearchDiscovery() {
  //sample data
  const dummyResults = [
    {
      id: 1,
      title: "The Mage Chronicles",
      cover: "https://via.placeholder.com/130x170",
      rate: 4.5,
      status: "Ongoing",
      genres: ["Fantasy", "Adventure"],
      tags: ["Magic", "Guild", "Strong MC"],
      summary: "A young mage embarks on a quest to master forbidden spells and uncover his destiny.",
      views: 1200,
      chapters: 35,
      favorites: 89,
    },
    {
      id: 2,
      title: "Love in the Time of Dragons",
      cover: "https://via.placeholder.com/130x170",
      rate: 4.2,
      status: "Completed",
      genres: ["Romance", "Fantasy"],
      tags: ["Dragon", "Royalty", "Tragedy"],
      summary: "An unlikely romance between a dragon prince and a human warrior.",
      views: 987,
      chapters: 28,
      favorites: 112,
    },
  ];

  // dummy options
  const genreOptions = [
    "Fantasy", "Romance", "Adventure", "Drama", "Comedy",
    "Action", "Horror", "Mystery", "Slice of Life", "Sci-Fi"
  ];

  const tagOptions = [
    "Magic", "System", "Reincarnation", "Isekai", "Overpowered",
    "Villainess", "RomCom", "Tragedy", "Friendship", "School Life"
  ];

  const contentWarnings = ["Sexual Content", "Strong Language", "Gore"];
  const storyStatuses = ["Ongoing", "Completed", "Hiatus"];
  const sortOptions = ["Page Views", "Ratings", "Favorites"];

  // state
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // handle adding genres
  const handleGenreSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedGenres.includes(selected)) {
      setSelectedGenres([...selectedGenres, selected]);
    }
  };

  // handle adding tags
  const handleTagSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedTags.includes(selected)) {
      setSelectedTags([...selectedTags, selected]);
    }
  };

  // handle removing
  const removeGenre = (genre) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // reset all filters
  const handleReset = () => {
    setSelectedGenres([]);
    setSelectedTags([]);
  };

  return (
    <div className="discoverypage">
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <NavLink to='/search-discovery'>Read Series</NavLink>
      </div>
      <div className="search-discovery-container">
        <h1>Search and Discover Series</h1>
        <hr />

        <div className="filters-container">

          {/* Genres */}
          <div className="filter-box">
            <h2>Genres</h2>
            <select onChange={handleGenreSelect}>
              <option value="">Select Genre</option>
              {genreOptions.map((genre, i) => (
                <option key={i} value={genre}>{genre}</option>
              ))}
            </select>

            <div className="selected-items">
              {selectedGenres.map((genre, i) => (
                <div key={i} className="chip">
                  {genre}
                  <button onClick={() => removeGenre(genre)} className="remove-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="filter-box">
            <h2>Tags</h2>
            <select onChange={handleTagSelect}>
              <option value="">Select Tag</option>
              {tagOptions.map((tag, i) => (
                <option key={i} value={tag}>{tag}</option>
              ))}
            </select>

            <div className="selected-items">
              {selectedTags.map((tag, i) => (
                <div key={i} className="chip">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="remove-btn">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content Warnings */}
          <div className="filter-box">
            <h2>Content Warnings</h2>
            <div className="checkbox-group">
              {contentWarnings.map((cw, i) => (
                <label key={i}>
                  <input type="checkbox" value={cw.toLowerCase()} /> {cw}
                </label>
              ))}
            </div>
          </div>

          {/* Story Status */}
          <div className="filter-box">
            <h2>Story Status</h2>
            <select>
              <option value="">Select Status</option>
              {storyStatuses.map((status, i) => (
                <option key={i} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-box">
            <h2>Sort By</h2>
            <div className="sort-group">
              <select>
                <option value="">Select Criteria</option>
                {sortOptions.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
              <select>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="buttons-container">
            <button className="btn btn-yellow">
              <i className="fas fa-search"></i> Search
            </button>
            <button className="btn btn-gray" onClick={handleReset}>
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="results">
          <h2>Results ({dummyResults.length})</h2>
        </div>

        <div className="results-grid">
          {dummyResults.map((r, i) => (
            <ResultCard key={i} {...r} onClick={() => alert(`Clicked ${r.title}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchDiscovery;
