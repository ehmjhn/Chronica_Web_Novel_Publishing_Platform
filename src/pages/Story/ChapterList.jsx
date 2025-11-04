import "./story.css";
import { useState } from "react";
import { NavLink } from "react-router";
import { closestCorners, DndContext } from "@dnd-kit/core";
import SortableChapter from "../../components/SortableChapter";
import { arrayMove } from "@dnd-kit/sortable";

function ChapterList() {
  //mock data
  const [chapters, setChapters] = useState([
    { id: 1, title: "Chapter 1: Title", date: "Date Released", order: 1 },
    { id: 2, title: "Chapter 2: Title", date: "Date Released", order: 2 },
    { id: 3, title: "Chapter 3: Title", date: "Date Released", order: 3 },
    { id: 4, title: "Chapter 4: Title", date: "Date Released", order: 4 },
    { id: 5, title: "Chapter 5: Title", date: "Date Released", order: 5 },
    { id: 6, title: "Chapter 6: Title", date: "Date Released", order: 6 },
    { id: 7, title: "Chapter 7: Title", date: "Date Released", order: 7 },
    { id: 8, title: "Chapter 8: Title", date: "Date Released", order: 8 },
    { id: 9, title: "Chapter 9: Title", date: "Date Released", order: 9 },
    { id: 10, title: "Chapter 10: Title", date: "Date Released", order: 10 },
    { id: 11, title: "Chapter 11: Title", date: "Date Released", order: 11 },
    { id: 12, title: "Chapter 12: Title", date: "Date Released", order: 12 },
    { id: 13, title: "Chapter 13: Title", date: "Date Released", order: 13 },
  ]);

  const [limit, setLimit] = useState(10);
  const [orderAsc, setOrderAsc] = useState(true);
  const [page, setPage] = useState(1);

  const sortedChapters = [...chapters].sort((a, b) =>
    orderAsc ? b.order - a.order : a.order - b.order
  );

  const startIndex = (page - 1) * limit;
  const paginatedChapters =
    limit === chapters.length
        ? sortedChapters // show all chapters
        : sortedChapters.slice(startIndex, startIndex + limit);

  const totalPages = Math.ceil(chapters.length / limit);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over.id || active.id === over.id) return;

    setChapters((chapters) => {
      const originalPos = chapters.findIndex((ch) => ch.id === active.id);
      const newPos = chapters.findIndex((ch) => ch.id === over.id);

      const newChapters = arrayMove(chapters, originalPos, newPos);

      return newChapters.map((ch, index) => ({ ...ch, order: index + 1 }));
    });
  };

  return (
    <div className="storyview-page">
        <div className="subnav-control">
            <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
            <NavLink to='/my-series'>My Series</NavLink> / 
            <NavLink to='/update-chapter-list'>Update Chapters</NavLink> / 
        </div>
      <div className="chapter-section">
        <div className="chapter-list-container">
        <div className="series-chapter-link">
            <NavLink to='/update-story'>Series Details</NavLink>
            <NavLink to='/update-chapter-list'>Chapter List</NavLink>
        </div>
          <div className="chapt-header">
            <h2>CHAPTER LIST TABLE ({chapters.length})</h2>
            <div className="chapter-controls">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10 Chapters</option>
                <option value={15}>15 Chapters</option>
                <option value={25}>25 Chapters</option>
                <option value={50}>50 Chapters</option>
                <option value={75}>75 Chapters</option>
                <option value={100}>100 Chapters</option>
                <option value={chapters.length}>All Chapters</option>
              </select>
              <button onClick={() => setOrderAsc(!orderAsc)}>
                <i className="fa-solid fa-filter"></i>
                {orderAsc ? "Latest" : "Oldest"}
              </button>

              <button className="save-changes"
                onClick={() => {
                    console.log("Saved chapters order:", chapters);
                    alert("Chapter order saved!");
                }}>
                Save Changes
                </button>
            </div>
          </div>

          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <SortableChapter chapters={paginatedChapters} />
          </DndContext>

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
