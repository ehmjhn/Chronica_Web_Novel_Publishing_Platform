import './reader.css';
import React from 'react';

function SearchDiscovery() {
  return (
    <>
      <div className="search-discovery-container">
        <h1>Search And Discovery</h1>
        <hr />
      </div>

      <div className="main-genres-container">
        <div className="genre-item">
          <h2>Main Genre</h2>
          <label htmlFor="content">Select Main Genre:</label>
          <select name="content" id="content">
            <option value="fun">Fun</option>
            <option value="fantasy">Fantasy</option>
            <option value="romance">Romance</option>
            <option value="adventure">Adventure</option>
            <option value="drama">Drama</option>
          </select>

          <div className="content-warning-container">
            <h3>Content Warning (Radio)</h3>
            <label className="radio-label">
              <input type="radio" name="warning" value="sexual" />
              Sexual Content
            </label>
            <label className="radio-label">
              <input type="radio" name="warning" value="language" />
              Strong Language
            </label>
            <label className="radio-label">
              <input type="radio" name="warning" value="gore" />
              Gore
            </label>
          </div>

          <div className="genre-checkbox-container">
            <h3>Content Warning (Checkbox)</h3>
            <label className="check-box">
              <input type="checkbox" name="genre" value="sexual" />
              Sexual Content
            </label>
            <label className="check-box">
              <input type="checkbox" name="genre" value="violence" />
              Violence
            </label>
            <label className="check-box">
              <input type="checkbox" name="genre" value="drugs" />
              Drugs
            </label>
            <label className="check-box">
              <input type="checkbox" name="genre" value="language" />
              Strong Language
            </label>
            <label className="check-box">
              <input type="checkbox" name="genre" value="other" />
              Other
            </label>
          </div>

          <div className="story-status-container">
            <h3>Story Status</h3>
            <select name="status-content" id="status-content">
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="hiatus">Hiatus</option>
            </select>
            <hr />
          </div>

          <div className="buttons-container">
            <button>Sample 1</button>
            <button>Sample 2</button>
          </div>
        </div>

        <div className="results">
          <h3>Result (0)</h3>
        </div>
      </div>
    </>
  );
}

export default SearchDiscovery;
