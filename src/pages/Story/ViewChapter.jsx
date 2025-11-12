import "./story.css";
import StoryView from "./StoryView";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { retrieveChapter } from "../../firebase/db";

function ViewChapter() {
  const [limit, setLimit] = useState(10); 
  const [orderAsc, setOrderAsc] = useState(true);
  const [page, setPage] = useState(1);

  const {id} = useParams();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    retrieveChapter((chaps) => {
      if (!chaps) return;

      const storyChaps = chaps.filter(c => c.storyId === id);
      setChapters(storyChaps || []);
    });
  }, [id]);

  const sortedChapters = [...chapters].sort((a, b) =>
    orderAsc ? a.order - b.order : b.order - a.order
  );

  const startIndex = (page - 1) * limit;
  const paginatedChapters = sortedChapters.slice(startIndex, startIndex + limit);

  const totalPages = Math.ceil(chapters.length / limit);

  return (
    <div className="storyview-page">
      <StoryView />

      <div className="chapter-section">
        <div className="chapter-list-container">
          <div className="chapt-header">
            <h2>CHAPTER LIST TABLE {`(${chapters.length})`}</h2>
            <div className="chapter-controls">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1); 
                }}
              >
                <option value={10}>10 Chapters</option>
                <option value={25}>25 Chapters</option>
                <option value={50}>50 Chapters</option>
                <option value={75}>75 Chapters</option>
                <option value={100}>100 Chapters</option>
              </select>
              <button onClick={() => setOrderAsc(!orderAsc)}>
                <i className="fa-solid fa-filter"></i>
                {orderAsc ? "Latest" : "Oldest"}
              </button>
            </div>
          </div>

          {chapters.length > 0 ?
            paginatedChapters.map((chapter, k) => (
              <NavLink to={`/read-chapter/${chapter.id}`} key={k} className="chapter-item">
                <span>{chapter.chapterTitle}</span>
                <span className="chapter-date">{chapter.publishDate}</span>
              </NavLink>
            )) :
            <p style={{margin: "0 auto"}}>No Chapter Available.</p>
          }

          <div className="chapter-pagination">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Back
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewChapter;
