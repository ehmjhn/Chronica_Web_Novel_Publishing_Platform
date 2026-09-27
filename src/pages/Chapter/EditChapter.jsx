import { Link, useNavigate, useParams } from "react-router";
import ChapterEditor from "../../components/ChapterEditor";
import { EmptyState, LoadingState } from "../../components/States";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getChapter, getStory, updateChapter } from "../../firebase/db";
import { PLACEHOLDER_COVER } from "../../lib/constants.js";
import "./chapter.css";

export default function EditChapter() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { run, busy } = useAsyncAction();

  const { data: chapter, loading } = useAsyncData(() => getChapter(id), [id]);
  const { data: story } = useAsyncData(
    () => (chapter?.storyId ? getStory(chapter.storyId) : null),
    [chapter?.storyId]
  );

  async function handleSubmit({ chapterTitle, content }) {
    const result = await run(() => updateChapter(id, { chapterTitle, content, authorId: user.uid }), {
      success: "Chapter updated.",
    });
    if (result) navigate(`/update-chapter-list/${chapter.storyId}`);
  }

  if (loading) return <LoadingState label="Loading chapter…" />;

  if (!chapter) {
    return (
      <div className="page-background">
        <EmptyState
          icon="fa-triangle-exclamation"
          title="Chapter not found"
          message="This chapter may have been deleted."
          action={
            <Link to="/my-series" className="btn btn-yellow">
              Back to My Series
            </Link>
          }
        />
      </div>
    );
  }

  if (story && story.authorId !== user?.uid) {
    return (
      <div className="page-background">
        <EmptyState
          icon="fa-lock"
          title="Not your chapter"
          message="You can only edit chapters on series that you published."
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
    <div className="page-background">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <Link to="/my-series">My Series</Link> /{" "}
        <Link to={`/update-chapter-list/${chapter.storyId}`}>Update Chapters</Link> /{" "}
        <span>Edit Chapter</span>
      </div>

      <div className="addchapter-container">
        <div className="addchapter-header">
          <h1>Edit Chapter</h1>
          <hr />
        </div>

        {story && (
          <div className="series-info">
            <h2>Selected Series</h2>
            <div className="series-card">
              <div className="series-image">
                <img
                  src={story.coverImage || PLACEHOLDER_COVER}
                  alt={`Cover of ${story.title}`}
                />
              </div>
              <div className="series-details">
                <h3 className="series-title">{story.title}</h3>
                <p className="series-genre">
                  {(story.genre || []).map((genre) => (
                    <span key={genre} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </p>
                <p className="series-description">{story.synopsis}</p>
              </div>
            </div>
          </div>
        )}

        <div className="chapter-form">
          <h2>Edit Chapter Details</h2>
          {/* key forces a fresh editor seeded from stored content, so the
              previously broken save path cannot come back. */}
          <ChapterEditor
            key={chapter.id}
            initialTitle={chapter.chapterTitle || ""}
            initialContent={chapter.content || ""}
            submitLabel={busy ? "Saving…" : "Update chapter"}
            busy={busy}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/update-chapter-list/${chapter.storyId}`)}
          />
        </div>
      </div>
    </div>
  );
}
