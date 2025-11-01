import React, { useState } from "react";
import StoryView from "./StoryView";
import "./story.css";

//mock database
const chapters = [
  { id: 1, title: "Chapter 1: Title", date: "Date Released" },
  { id: 2, title: "Chapter 2: Title", date: "Date Released" },
  { id: 3, title: "Chapter 3: Title", date: "Date Released" },
  { id: 4, title: "Chapter 4: Title", date: "Date Released" },
  { id: 5, title: "Chapter 5: Title", date: "Date Released" },
  { id: 6, title: "Chapter 6: Title", date: "Date Released" },
  { id: 7, title: "Chapter 7: Title", date: "Date Released" },
  { id: 8, title: "Chapter 8: Title", date: "Date Released" },
  { id: 9, title: "Chapter 9: Title", date: "Date Released" },
  { id: 10, title: "Chapter 10: Title", date: "Date Released" },
  { id: 11, title: "Chapter 11: Title", date: "Date Released" },
  { id: 12, title: "Chapter 12: Title", date: "Date Released" },
  { id: 13, title: "Chapter 13: Title", date: "Date Released" },
];

function ChapterList() {
  const [limit, setLimit] = useState(10); 
  const [orderAsc, setOrderAsc] = useState(true);
  const [page, setPage] = useState(1);

  const sortedChapters = [...chapters].sort((a, b) =>
    orderAsc ? a.id - b.id : b.id - a.id
  );

  const startIndex = (page - 1) * limit;
  const paginatedChapters = sortedChapters.slice(startIndex, startIndex + limit);

  const totalPages = Math.ceil(chapters.length / limit);

  return (
    <div className="storyview-page">
      <StoryView />

      <div className="chapter-section">
        <div className="chapter-list-container">
          <div className="chapter-header">
            <h2>CHAPTER LIST TABLE {`(${chapters.length})`}</h2>
            <div className="chapter-controls">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1); 
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
              </select>
              <button onClick={() => setOrderAsc(!orderAsc)}>
                {orderAsc ? "Asc" : "Desc"}
              </button>
            </div>
          </div>

          {paginatedChapters.map((chapter) => (
            <div key={chapter.id} className="chapter-item">
              <span>{chapter.title}</span>
              <span className="chapter-date">{chapter.date}</span>
            </div>
          ))}

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

export default ChapterList;
