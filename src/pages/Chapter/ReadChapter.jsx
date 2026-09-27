import { useEffect, useMemo } from "react";
import "./chapter.css";
import { Link, useNavigate, useParams } from "react-router";
import { EmptyState, LoadingState } from "../../components/States";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useStoryChapters } from "../../hooks/useChapters";
import { getChapter, getStory, getUserProfile } from "../../firebase/db";
import { sanitizeChapterHtml } from "../../lib/sanitize";
import { displayNameOf, formatNumber } from "../../lib/format";
import { PLACEHOLDER_COVER } from "../../lib/constants.js";

export default function ReadChapter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: chapter, loading: chapterLoading, error } = useAsyncData(() => getChapter(id), [id]);
  const { data: story } = useAsyncData(
    () => (chapter?.storyId ? getStory(chapter.storyId) : null),
    [chapter?.storyId]
  );
  const { data: author } = useAsyncData(
    () => (story?.authorId ? getUserProfile(story.authorId) : null),
    [story?.authorId]
  );
  const { chapters } = useStoryChapters(chapter?.storyId);

  // Sanitised once per chapter body. Rendering the stored HTML verbatim let any
  // author run script in every reader's browser (stored XSS).
  const safeContent = useMemo(() => sanitizeChapterHtml(chapter?.content), [chapter?.content]);

  const currentIndex = useMemo(
    () => (chapter ? chapters.findIndex((c) => c.id === chapter.id) : -1),
    [chapter, chapters]
  );

  const previous = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Send the reader back to the top when they move between chapters.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  if (chapterLoading) return <LoadingState label="Loading chapter…" />;

  if (error) {
    return (
      <div className="page-background">
        <EmptyState
          icon="fa-triangle-exclamation"
          title="Unable to load this chapter"
          message={error.message}
          action={
            <Link to="/home" className="btn btn-gray">
              Go home
            </Link>
          }
        />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="page-background">
        <EmptyState
          icon="fa-file-circle-question"
          title="Chapter not found"
          message="This chapter may have been removed by its author."
          action={
            <Link to="/search-discovery" className="btn btn-yellow">
              Browse other series
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-background">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / {story ? <Link to={`/story-chapter-list/${story.id}`}>Chapter List</Link> : <span>Chapter List</span>} /{" "}
        <i>{chapter.chapterTitle}</i>
      </div>

      <article className="read-bg">
        <header className="chapter-header">
          <div className="series-cover">
            <img
              src={story?.coverImage || PLACEHOLDER_COVER}
              alt={story ? `Cover of ${story.title}` : ""}
            />
          </div>

          <div className="series-meta">
            <h2 className="series-title">{story?.title || "Loading…"}</h2>
            {author && <p className="author">by {displayNameOf(author)}</p>}

            <div className="meta-stats">
              <div className="stat">
                <i className="fa-solid fa-eye" aria-hidden="true" /> {formatNumber(story?.views)}
              </div>
              <div className="stat">
                <i className="fa-solid fa-heart" aria-hidden="true" /> {formatNumber(story?.likes)}
              </div>
              {story?.rate > 0 && (
                <div className="stat rating">
                  <i className="fa-solid fa-star" aria-hidden="true" /> {(Number(story.rate) || 0).toFixed(1)}/5
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="chapter-title">
          {previous ? (
            <button className="nav-btn prev" onClick={() => navigate(`/read-chapter/${previous.id}`)}>
              <i className="fa-solid fa-angle-left" aria-hidden="true" /> Previous
            </button>
          ) : (
            <button className="nav-btn prev" disabled>
              Previous
            </button>
          )}

          <h3>
            {chapter.order ? `Chapter ${chapter.order}: ` : ""}
            {chapter.chapterTitle}
          </h3>

          {next ? (
            <button className="nav-btn next" onClick={() => navigate(`/read-chapter/${next.id}`)}>
              Next <i className="fa-solid fa-angle-right" aria-hidden="true" />
            </button>
          ) : (
            <button className="nav-btn next" disabled>
              Next
            </button>
          )}
        </div>

        {safeContent ? (
          <div className="chapter-content ql-editor" dangerouslySetInnerHTML={{ __html: safeContent }} />
        ) : (
          <p className="muted chapter-empty">This chapter has no content yet.</p>
        )}

        <footer className="chapter-footer">
          {previous ? (
            <button className="nav-btn prev" onClick={() => navigate(`/read-chapter/${previous.id}`)}>
              <i className="fa-solid fa-angle-left" aria-hidden="true" /> Previous
            </button>
          ) : (
            <button className="nav-btn prev" disabled>
              Previous
            </button>
          )}

          {story && (
            <Link to={`/story-chapter-list/${story.id}`} className="chapter-list-btn">
              Chapter List
            </Link>
          )}

          {next ? (
            <button className="nav-btn next" onClick={() => navigate(`/read-chapter/${next.id}`)}>
              Next <i className="fa-solid fa-angle-right" aria-hidden="true" />
            </button>
          ) : (
            <button className="nav-btn next" disabled>
              Next
            </button>
          )}
        </footer>
      </article>
    </div>
  );
}
