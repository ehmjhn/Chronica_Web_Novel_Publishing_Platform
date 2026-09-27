import "./reader.css";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  GENRES,
  TAGS,
  STORY_STATUSES,
  CONTENT_WARNINGS,
  SORT_OPTIONS,
} from "../../lib/constants.js";
import { searchStories } from "../../lib/search";
import { useStoriesWithAuthors } from "../../hooks/useStories";
import { useChapterCounts } from "../../hooks/useChapters";
import ResultCard from "../../components/ResultCard";
import { EmptyState } from "../../components/States";

const SEARCHABLE_WARNINGS = CONTENT_WARNINGS.filter((w) => w !== "None");

function ChipList({ items, onRemove, className = "chip" }) {
  if (!items.length) return null;
  return (
    <div className="selected-items">
      {items.map((item) => (
        <span key={item} className={className}>
          {item}
          <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item}`}>
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  );
}

export default function SearchDiscovery() {
  const { stories } = useStoriesWithAuthors();
  const chapterCounts = useChapterCounts();

  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [tags, setTags] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [genrePicker, setGenrePicker] = useState("");
  const [tagPicker, setTagPicker] = useState("");

  // Filtering runs live, so the Search button is no longer needed.
  const results = useMemo(
    () =>
      searchStories(stories, { query, genres, tags, warnings, status, sortBy, sortOrder }, chapterCounts),
    [stories, query, genres, tags, warnings, status, sortBy, sortOrder, chapterCounts]
  );

  const addTo = (setter) => (value) => {
    if (value) setter((list) => (list.includes(value) ? list : [...list, value]));
  };

  const removeFrom = (setter) => (value) => setter((list) => list.filter((item) => item !== value));

  function resetAll() {
    setQuery("");
    setGenres([]);
    setTags([]);
    setWarnings([]);
    setStatus("");
    setSortBy("");
    setSortOrder("desc");
    setGenrePicker("");
    setTagPicker("");
  }

  return (
    <div className="discoverypage">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <span>Read Series</span>
      </div>

      <div className="search-discovery-container">
        <h1>Search and Discover Series</h1>
        <hr />

        <div className="filters-container">
          <div className="filter-box filter-box--wide">
            <h2>Keywords</h2>
            <input
              type="search"
              placeholder="Search by title, author, synopsis or tag…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search stories"
            />
          </div>

          <div className="filter-box">
            <h2>Genres</h2>
            <select
              value={genrePicker}
              onChange={(event) => {
                addTo(setGenres)(event.target.value);
                setGenrePicker("");
              }}
              aria-label="Add a genre filter"
            >
              <option value="">Select Genre</option>
              {GENRES.filter((genre) => !genres.includes(genre)).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <ChipList items={genres} onRemove={removeFrom(setGenres)} />
          </div>

          <div className="filter-box">
            <h2>Tags</h2>
            <select
              value={tagPicker}
              onChange={(event) => {
                addTo(setTags)(event.target.value);
                setTagPicker("");
              }}
              aria-label="Add a tag filter"
            >
              <option value="">Select Tag</option>
              {TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <ChipList items={tags} onRemove={removeFrom(setTags)} />
          </div>

          <div className="filter-box">
            <h2>Content Warnings</h2>
            <div className="checkbox-group">
              {SEARCHABLE_WARNINGS.map((warning) => (
                <label key={warning}>
                  <input
                    type="checkbox"
                    value={warning}
                    checked={warnings.includes(warning)}
                    onChange={(event) =>
                      setWarnings((list) =>
                        event.target.checked
                          ? [...list, warning]
                          : list.filter((item) => item !== warning)
                      )
                    }
                  />{" "}
                  {warning}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-box">
            <h2>Story Status</h2>
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              <option value="">Any status</option>
              {STORY_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-box">
            <h2>Sort By</h2>
            <div className="sort-group">
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort by">
                <option value="">Relevance</option>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value="createdAt">Newest</option>
              </select>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort order">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="buttons-container">
            <button type="button" className="btn btn-gray" onClick={resetAll}>
              <i className="fa-solid fa-rotate-left" aria-hidden="true" /> Reset
            </button>
          </div>
        </div>

        <div className="results">
          <h2>
            Results ({results.length}){" "}
            {stories.length > 0 && <small className="results__of">of {stories.length} series</small>}
          </h2>
        </div>

        <div className="results-grid">
          {results.length > 0 ? (
            results.map((story) => (
              <ResultCard
                key={story.id}
                id={story.id}
                title={story.title}
                coverImage={story.coverImage}
                rate={story.rate}
                status={story.status}
                genre={story.genre}
                tags={story.tags}
                synopsis={story.synopsis}
                views={story.views}
                chapters={story.chapters}
                likes={story.likes}
              />
            ))
          ) : (
            <EmptyState
              icon="fa-magnifying-glass"
              title="No stories match those filters"
              message="Try removing a filter or searching for a different keyword."
              action={
                <button type="button" className="btn btn-gray" onClick={resetAll}>
                  Clear filters
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
