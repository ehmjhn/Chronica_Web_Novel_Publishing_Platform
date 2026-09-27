import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import "./reader.css";
import ResultCard from "../../components/ResultCard";
import Pagination from "../../components/Pagination";
import { EmptyState, LoadingState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useSubscription } from "../../hooks/useSubscription";
import { readComic, retrieveChapter, subscribeUserProfile, updateBookmark } from "../../firebase/db";
import { PAGE_SIZE_OPTIONS } from "../../lib/constants.js";

export default function Bookmark() {
  const { user } = useAuthUser();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState(null);

  // Bookmarks live on the Realtime Database profile, not on the Auth user, and
  // the list is subscribed so a removal updates without a refetch.
  const { data: bookmarkProfile } = useSubscription(
    (cb) => subscribeUserProfile(user?.uid, cb),
    [user?.uid],
    { enabled: Boolean(user?.uid), initial: null }
  );

  const { data: stories, loading: storiesLoading } = useSubscription(
    (cb) => readComic(cb),
    [],
    { initial: [] }
  );
  // Chapter totals for every series, counted once instead of per bookmark.
  const { data: allChapters } = useSubscription(
    (cb) => retrieveChapter(cb),
    [],
    { initial: [] }
  );

  const chapterCounts = useMemo(() => {
    const counts = {};
    for (const chapter of allChapters) {
      counts[chapter.storyId] = (counts[chapter.storyId] || 0) + 1;
    }
    return counts;
  }, [allChapters]);

  const bookmarkedIds = bookmarkProfile?.bookmarkedStories;
  const bookmarked = useMemo(() => {
    if (!Array.isArray(bookmarkedIds) || !bookmarkedIds.length) return [];

    return stories
      .filter((story) => bookmarkedIds.includes(story.id))
      .map((story) => ({
        ...story,
        chapters: chapterCounts[story.id] || 0,
        views: story.views || 0,
        likes: story.likes || 0,
      }));
  }, [stories, bookmarkedIds, chapterCounts]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookmarked;
    return bookmarked.filter((story) => String(story.title || "").toLowerCase().includes(term));
  }, [bookmarked, search]);

  // Keep the page in range when a filter shrinks the list under the cursor.
  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  async function handleRemove(story) {
    if (!user || removing) return;
    setRemoving(story.id);
    try {
      // The old call passed a third callback argument, so the card never left
      // the list: updateBookmark's signature is (userId, storyId).
      const result = await updateBookmark(user.uid, story.id);
      toast.success(
        result.isBookmarked ? "Added back to your list." : `Removed "${story.title}".`
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRemoving(null);
    }
  }

  if (storiesLoading) return <LoadingState label="Loading your bookmarks…" />;

  return (
    <div className="bookmark-wrap">
      <div className="bookmark-cont">
        <div className="subnav-control">
          <Link to="/home">
            <i className="fa-solid fa-house" aria-hidden="true" />
          </Link>{" "}
          / <span>Bookmarks</span>
        </div>

        <div className="bookmark-settings">
          <h2>Bookmarked Series ({bookmarked.length})</h2>

          <label className="sr-only" htmlFor="bookmark-search">
            Search your bookmarks
          </label>
          <input
            id="bookmark-search"
            type="search"
            placeholder="Search title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <label className="sr-only" htmlFor="bookmark-per-page">
            Bookmarks per page
          </label>
          <select
            id="bookmark-per-page"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <hr />

        {bookmarked.length === 0 ? (
          <EmptyState
            icon="fa-bookmark"
            title="Your reading list is empty"
            message="Bookmark a series and it will show up here."
            action={
              <Link to="/search-discovery" className="btn btn-yellow">
                Find something to read
              </Link>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="fa-magnifying-glass"
            title="No matches"
            message={`Nothing in your list matches "${search}".`}
            action={
              <button type="button" className="btn btn-gray" onClick={() => setSearch("")}>
                Clear search
              </button>
            }
          />
        ) : (
          <>
            <div className="results-grid">
              {filtered.slice((page - 1) * limit, page * limit).map((story) => (
                <ResultCard
                  key={story.id}
                  {...story}
                  removable
                  busy={removing === story.id}
                  onRemove={(storyId) => {
                    const target = filtered.find((s) => s.id === storyId) || bookmarked.find((s) => s.id === storyId);
                    if (target) handleRemove(target);
                  }}
                />
              ))}
            </div>

            <Pagination page={page} total={filtered.length} perPage={limit} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
