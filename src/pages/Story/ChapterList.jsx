import "./story.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import SortableChapter from "../../components/SortableChapter";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import { EmptyState, LoadingState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useSubscription } from "../../hooks/useSubscription";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";
import { subscribeStoryChapters, getStory, saveOrder, deleteChapter } from "../../firebase/db";
import { PAGE_SIZE_OPTIONS } from "../../lib/constants.js";

export default function ChapterList() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  const { data: story, loading: storyLoading } = useAsyncData(() => getStory(id), [id]);
  const { data: chapters, loading } = useSubscription(
    (cb) => subscribeStoryChapters(id, cb),
    [id],
    { initial: [] }
  );

  // Local draft of the sequence. Dragging reorders the draft; Save pushes it
  // to Firebase. The draft resyncs whenever the live list changes.
  const [draft, setDraft] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderAsc, setOrderAsc] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setDraft(chapters);
    setDirty(false);
  }, [chapters]);

  // The previous version seeded `limit` from the chapter count, so an empty
  // series computed Math.ceil(0 / 0) => NaN and rendered "Page 1 of NaN".
  const totalPages = Math.max(1, Math.ceil(draft.length / limit));
  const clampedPage = Math.min(page, totalPages);
  const showingAll = limit >= draft.length;

  // Dragging only makes sense on the full ascending list: on a paginated or
  // reversed view the saved order would not match what the author sees.
  const canReorder = showingAll && orderAsc;

  const displayed = useMemo(() => {
    const ordered = orderAsc ? draft : [...draft].reverse();
    if (showingAll) return ordered;
    const start = (clampedPage - 1) * limit;
    return ordered.slice(start, start + limit);
  }, [draft, orderAsc, showingAll, clampedPage, limit]);

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    if (!canReorder) {
      toast.info('Choose "All Chapters" with ascending order to rearrange.');
      return;
    }

    const oldIndex = draft.findIndex((chapter) => chapter.id === active.id);
    const newIndex = draft.findIndex((chapter) => chapter.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    setDraft(arrayMove(draft, oldIndex, newIndex));
    setDirty(true);
  }

  async function handleSaveOrder() {
    const result = await run(() => saveOrder(draft, user.uid), { success: "Chapter order saved." });
    if (result) setDirty(false);
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const chapter = pendingDelete;
    // deleteChapter(storyId, chapterId, authorId)
    const result = await run(() => deleteChapter(chapter.storyId, chapter.id, user.uid));
    if (result) {
      setPendingDelete(null);
      toast.success(`"${chapter.chapterTitle}" has been deleted.`);
    }
  }

  if (storyLoading || loading) return <LoadingState label="Loading chapters…" />;

  if (!story) {
    return (
      <div className="storyview-page">
        <EmptyState
          icon="fa-triangle-exclamation"
          title="Series not found"
          message="This series may have been removed."
          action={
            <Link to="/my-series" className="btn btn-yellow">
              Back to My Series
            </Link>
          }
        />
      </div>
    );
  }

  if (story.authorId !== user?.uid) {
    return (
      <div className="storyview-page">
        <EmptyState
          icon="fa-lock"
          title="Not your series"
          message="You can only manage chapters on series that you published."
          action={
            <Link to="/my-series" className="btn btn-gray">
              Back to My Series
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <Link to="/my-series">My Series</Link> / <span>Update Chapters</span>
      </div>

      <div className="chapter-section">
        <div className="chapter-list-container">
          <div className="series-chapter-link">
            <Link to={`/update-story/${id}`}>Series Details</Link>
            <Link to={`/update-chapter-list/${id}`}>Chapter List</Link>
          </div>

          <div className="chapt-header">
            <h2>CHAPTER LIST TABLE ({draft.length})</h2>

            <div className="chapter-controls">
              <label className="sr-only" htmlFor="chapters-per-page">
                Chapters per page
              </label>
              <select
                id="chapters-per-page"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
              >
                {/* Only useful once the series outgrows the smallest page size. */}
                {draft.length > PAGE_SIZE_OPTIONS[0] && (
                  <option value={draft.length}>All Chapters ({draft.length})</option>
                )}
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} Chapters
                  </option>
                ))}
              </select>

              <button type="button" onClick={() => setOrderAsc((prev) => !prev)}>
                <i className="fa-solid fa-filter" aria-hidden="true" />{" "}
                {orderAsc ? "Ascending" : "Descending"}
              </button>

              <button
                type="button"
                className="save-changes"
                onClick={handleSaveOrder}
                disabled={!dirty || busy}
              >
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {draft.length === 0 ? (
            <EmptyState
              icon="fa-file-lines"
              title="No chapters yet"
              message="Publish your first chapter to start building this series."
              action={
                <Link to={`/create-chapter/${id}`} className="btn btn-yellow">
                  Add chapter
                </Link>
              }
            />
          ) : (
            <>
              {!canReorder && (
                <p className="muted">
                  Reordering is available on the full ascending list. Use Save Changes to commit a
                  new sequence.
                </p>
              )}

              <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableChapter
                  chapters={displayed}
                  onDelete={setPendingDelete}
                  disabled={!canReorder}
                />
              </DndContext>

              <Pagination
                page={clampedPage}
                total={draft.length}
                perPage={limit}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this chapter?"
        message={`"${pendingDelete?.chapterTitle}" will be permanently removed from this series. This cannot be undone.`}
        confirmLabel="Delete chapter"
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
