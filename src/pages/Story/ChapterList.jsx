import "./story.css";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { closestCorners, DndContext } from "@dnd-kit/core";
import SortableChapter from "../../components/SortableChapter";
import { arrayMove } from "@dnd-kit/sortable";
import { retrieveChapter, saveOrder } from "../../firebase/db";

function ChapterList() {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [limit, setLimit] = useState(0);
  const [orderAsc, setOrderAsc] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const unsubscribe = retrieveChapter((chaps) => {
      if (!chaps) return;

      const storyChaps = chaps.filter((c) => c.storyId === id);

      storyChaps.sort((a, b) => a.order - b.order);

      setChapters(storyChaps);
      setLimit(storyChaps.length);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [id]);

  const sortedChapters = [...chapters].sort((a, b) =>
    orderAsc ? a.order - b.order : b.order - a.order
  );

  const startIndex = (page - 1) * limit;
  const paginatedChapters =
    limit >= chapters.length
      ? sortedChapters
      : sortedChapters.slice(startIndex, startIndex + limit);

  const totalPages = Math.ceil(chapters.length / limit);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over?.id || active.id === over.id) return;

    setChapters((prevChapters) => {
      const oldIndex = prevChapters.findIndex((ch) => ch.id === active.id);
      const newIndex = prevChapters.findIndex((ch) => ch.id === over.id);

      return arrayMove(prevChapters, oldIndex, newIndex).map((ch, idx) => ({
        ...ch,
        order: idx + 1,
      }));
    });
  };

  function handlesaveOrder() {
    if (confirm("Do you want to save changes?")) {
      saveOrder(chapters)
    }
    else {
      return
    }
  };

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <NavLink to="/home"><i className="fa-solid fa-home"></i></NavLink>{" "} /
        <NavLink to="/my-series">My Series</NavLink> /{" "}
        <NavLink to="/update-chapter-list">Update Chapters</NavLink> /
      </div>

      <div className="chapter-section">
        <div className="chapter-list-container">
          <div className="series-chapter-link">
            <NavLink to={`/update-story/${id}`}>Series Details</NavLink>
            <NavLink to={`/update-chapter-list/${id}`}>Chapter List</NavLink>
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
                <option value={chapters.length}>All Chapters</option>
                <option value={10}>10 Chapters</option>
                <option value={15}>15 Chapters</option>
                <option value={25}>25 Chapters</option>
                <option value={50}>50 Chapters</option>
                <option value={75}>75 Chapters</option>
                <option value={100}>100 Chapters</option>
              </select>

              <button onClick={() => setOrderAsc(!orderAsc)}>
                <i className="fa-solid fa-filter"></i>{" "}
                {orderAsc ? "Ascending" : "Descending"}
              </button>

              <button className="save-changes" onClick={handlesaveOrder}>
                Save Changes
              </button>
            </div>
          </div>

          {chapters.length > 0 && (
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
              <SortableChapter chapters={paginatedChapters} />
            </DndContext>
          )}

          {limit < chapters.length && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterList;
