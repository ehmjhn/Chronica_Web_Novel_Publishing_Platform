import "./story.css";
import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router";
import StoryView from "./StoryView";
import { EmptyState } from "../../components/States";
import Pagination from "../../components/Pagination";
import { useStoryChapters } from "../../hooks/useChapters";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getStory } from "../../firebase/db";
import { formatDate, formatDateTime, pageCount } from "../../lib/format";
import { PAGE_SIZE_OPTIONS } from "../../lib/constants.js";

export default function ViewChapter() {
  const { id } = useParams();
  const { chapters, loading } = useStoryChapters(id);
  const { data: story } = useAsyncData(() => getStory(id), [id]);

  const [pageSize, setPageSize] = useState(25);
  const [newestFirst, setNewestFirst] = useState(false);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => (newestFirst ? [...chapters].reverse() : chapters),
    [chapters, newestFirst]
  );

  const totalPages = pageCount(chapters.length, pageSize);

  // Clamp the page if the chapter list shrinks underneath us.
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const visible = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize]
  );

  return (
    <div className="storyview-page">
      <StoryView />

      <div className="chapter-section">
        <div className="chapter-list-container">
          <div className="chapt-header">
            <h2>Chapter List ({chapters.length})</h2>
            <div className="chapter-controls">
              <label className="sr-only" htmlFor="chapter-page-size">
                Chapters per page
              </label>
              <select
                id="chapter-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setNewestFirst((value) => !value)}
                aria-pressed={newestFirst}
              >
                <i className="fa-solid fa-arrow-down-wide-short" aria-hidden="true" />{" "}
                {newestFirst ? "Newest first" : "Oldest first"}
              </button>

              {story?.authorId && (
                <Link to={`/update-chapter-list/${id}`} className="btn btn-gray">
                  <i className="fa-solid fa-pen" aria-hidden="true" /> Manage
                </Link>
              )}
            </div>
          </div>

          {loading ? (
            <p className="muted">Loading chapters…</p>
          ) : chapters.length === 0 ? (
            <EmptyState
              icon="fa-file-lines"
              title="No chapters yet"
              message="This series has not published any chapters."
            />
          ) : (
            <>
              <ol className="chapter-index">
                {visible.map((chapter) => (
                  <li key={chapter.id}>
                    <Link to={`/read-chapter/${chapter.id}`} className="chapter-item">
                      <span className="chapter-number">{chapter.order}</span>
                      <span className="chapter-title">{chapter.chapterTitle}</span>
                      <span className="chapter-date">
                        Published {formatDateTime(chapter.publishDate)}
                        {chapter.updatedDate && <br />}
                        {chapter.updatedDate && <>Updated {formatDate(chapter.updatedDate)}</>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>

              <Pagination
                page={page}
                total={chapters.length}
                perPage={pageSize}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
