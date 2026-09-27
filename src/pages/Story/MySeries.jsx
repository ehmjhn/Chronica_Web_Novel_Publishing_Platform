import { useMemo, useState } from "react";
import "./story.css";
import { Link } from "react-router";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
import { EmptyState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useMyStories } from "../../hooks/useStories";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { deleteStory } from "../../firebase/db";
import { formatNumber, formatDate, byIdDesc } from "../../lib/format";
import { PAGE_SIZE_OPTIONS, PLACEHOLDER_COVER } from "../../lib/constants.js";

export default function MySeries() {
  const { user } = useAuthUser();
  const { stories, loading } = useMyStories(user?.uid);
  const toast = useToast();
  const { run, busy } = useAsyncAction();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);

  const sorted = useMemo(() => [...stories].sort(byIdDesc), [stories]);
  const visible = useMemo(
    () => sorted.slice((page - 1) * limit, page * limit),
    [sorted, page, limit]
  );

  async function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    const result = await run(() => deleteStory(target.id, user.uid));
    if (result) {
      setPendingDelete(null);
      toast.success(`"${target.title}" has been deleted.`);
    }
  }

  if (loading) return <LoadingSeries />;

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <span>My Series</span>
      </div>

      <div className="series-page">
        <div className="series-header">
          <h2>My Series ({sorted.length})</h2>
          <Link to="/create-story" className="add-series-btn">
            <i className="fa-solid fa-plus" aria-hidden="true" /> Add series
          </Link>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon="fa-feather-pointed"
            title="You have not published anything yet"
            message="Create your first series, then add chapters to start publishing."
            action={
              <Link to="/create-story" className="btn btn-yellow">
                Create your first series
              </Link>
            }
          />
        ) : (
          <>
            <div className="filter-section">
              <label htmlFor="series-per-page">Show per page: </label>
              <select
                id="series-per-page"
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="series-list">
              {visible.map((story) => (
                <article key={story.id} className="series-card">
                  <Link to={`/story-details/${story.id}`}>
                    <img
                      src={story.coverImage || PLACEHOLDER_COVER}
                      alt=""
                      className="series-img"
                      loading="lazy"
                    />
                  </Link>

                  <div className="series-info">
                    <h3 className="series-title">
                      <Link to={`/story-details/${story.id}`}>{story.title}</Link>
                    </h3>

                    <div className="series-genre">
                      {(story.genre || []).map((genre) => (
                        <span key={genre} className="genre-tag">
                          {genre}
                        </span>
                      ))}
                      {(story.tags || []).map((tag) => (
                        <span key={tag} className="tag-genre">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="series-desc">{story.synopsis || "No synopsis yet."}</p>

                    <span className="series-meta">
                      <i className="fa-solid fa-eye" aria-hidden="true" /> {formatNumber(story.views)} &nbsp;|&nbsp;
                      <i className="fa-solid fa-book" aria-hidden="true" /> {story.totalChapters || 0} chapters
                      &nbsp;|&nbsp;
                      <i className="fa-solid fa-heart" aria-hidden="true" /> {formatNumber(story.likes)}{" "}
                      favourites
                    </span>

                    <div className="series-buttons">
                      <Link to={`/create-chapter/${story.id}`} className="btn-yellow">
                        <i className="fa-solid fa-plus" aria-hidden="true" /> Add chapter
                      </Link>
                      <Link to={`/update-story/${story.id}`} className="btn-yellow">
                        <i className="fa-solid fa-pen" aria-hidden="true" /> Update
                      </Link>
                      <Link to={`/update-chapter-list/${story.id}`} className="btn-yellow">
                        <i className="fa-solid fa-list" aria-hidden="true" /> Chapters
                      </Link>
                    </div>

                    <small className="muted">Created {formatDate(story.createdAt)}</small>
                  </div>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => setPendingDelete(story)}
                    aria-label={`Delete ${story.title}`}
                  >
                    <i className="fa-solid fa-trash" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>

            <Pagination page={page} total={sorted.length} perPage={limit} onChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this series?"
        message={`"${pendingDelete?.title}" and all of its chapters and reviews will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete series"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function LoadingSeries() {
  return (
    <div className="homepage">
      <div className="state-block" role="status">
        <span className="state-spinner" aria-hidden="true" />
        <p>Loading your series…</p>
      </div>
    </div>
  );
}
