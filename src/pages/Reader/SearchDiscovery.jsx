import "./reader.css";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import ResultCard from "../../components/ResultCard";
import { readComic, retrieveGenres, retrieveTags } from "../../firebase/db";

function SearchDiscovery() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);

  const contentWarnings = ["Sexual Content", "Strong Language", "Gore"];
  const storyStatuses = ["Ongoing", "Completed", "Hiatus"];
  const sortOptions = ["Page Views", "Ratings", "Favorites"];

  const [genreOptions, setGenreOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCW, setSelectedCW] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchClicked, setSearchClicked] = useState(false);
  const [genreDropdown, setGenreDropdown] = useState(""); 
  const [tagDropdown, setTagDropdown] = useState("");

  useEffect(() => {
    readComic((data) => {
      setStories(data);
      setFilteredStories(data);
    });
    retrieveGenres((genres)=>{
      setGenreOptions(genres)
    })
    retrieveTags((tags)=>{
      setTagOptions(tags)
    })

  }, []);

  const handleGenreSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedGenres.includes(selected)) {
      setSelectedGenres([...selectedGenres, selected]);
    }
    setGenreDropdown("");
  };

  const handleTagSelect = (e) => {
    const selected = e.target.value;
    if (selected && !selectedTags.includes(selected)) {
      setSelectedTags([...selectedTags, selected]);
    }
    setTagDropdown("");
  };

  const handleCWChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedCW([...selectedCW, value]);
    } else {
      setSelectedCW(selectedCW.filter(cw => cw !== value));
    }
  };

  const removeGenre = (genre) => setSelectedGenres(selectedGenres.filter(g => g !== genre));
  const removeTag = (tag) => setSelectedTags(selectedTags.filter(t => t !== tag));

  const handleReset = () => {
    setSelectedGenres([]);
    setSelectedTags([]);
    setSelectedCW([]);
    setSelectedStatus("");
    setSortBy("");
    setSortOrder("desc");
    setFilteredStories([]);
    setSearchClicked(false);
    setGenreDropdown("");
    setTagDropdown("");
  };

  const handleSearch = () => {
    let results = [...stories];

    if (selectedGenres.length)
      results = results.filter(s => s.genre?.some(g => selectedGenres.includes(g)));

    if (selectedTags.length)
      results = results.filter(s => s.tags?.some(t => selectedTags.includes(t)));

    if (selectedCW.length)
      results = results.filter(s => s.contentWarning && selectedCW.some(cw => s.contentWarning.toLowerCase().includes(cw)));

    if (selectedStatus)
      results = results.filter(s => s.status === selectedStatus);

    if (sortBy) {
      results.sort((a, b) => {
        let aVal = 0, bVal = 0;
        if (sortBy === "Page Views") { aVal = a.views || 0; bVal = b.views || 0; }
        if (sortBy === "Ratings") { aVal = a.rate || 0; bVal = b.rate || 0; }
        if (sortBy === "Favorites") { aVal = a.likes || 0; bVal = b.likes || 0; }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    setFilteredStories(results);
    setSearchClicked(true);
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
            <select value={genreDropdown} onChange={handleGenreSelect}>
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
            <select value={tagDropdown} onChange={handleTagSelect}>
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
                  <input
                    type="checkbox"
                    value={cw.toLowerCase()}
                    checked={selectedCW.includes(cw.toLowerCase())}
                    onChange={handleCWChange}
                  /> {cw}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="filter-box">
            <h2>Story Status</h2>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">Select Status</option>
              {storyStatuses.map((status, i) => <option key={i} value={status}>{status}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="filter-box">
            <h2>Sort By</h2>
            <div className="sort-group">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Select Criteria</option>
                {sortOptions.map((option, i) => <option key={i} value={option}>{option}</option>)}
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="buttons-container">
            <button className="btn btn-yellow" onClick={handleSearch}>
              <i className="fas fa-search"></i> Search
            </button>
            <button className="btn btn-gray" onClick={handleReset}>
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>

        <div className="results">
          {searchClicked && <h2>Results ({filteredStories.length})</h2>}
        </div>

        <div className="results-grid">
          {searchClicked && filteredStories.map((r, i) => (
            <ResultCard key={i} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchDiscovery;