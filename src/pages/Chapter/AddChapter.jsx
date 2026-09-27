import { Link, useNavigate, useParams } from "react-router";
import ChapterEditor from "../../components/ChapterEditor";
import { EmptyState, LoadingState, InlineMessage } from "../../components/States";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuthUser } from "../../hooks/useAuthUser";
import { addChapter, getStory } from "../../firebase/db";
import { PLACEHOLDER_COVER } from "../../lib/constants.js";
import "./chapter.css";

export default function AddChapter() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { run, busy } = useAsyncAction();

  const { data: story, loading } = useAsyncData(() => getStory(id), [id]);

  async function handleSubmit({ chapterTitle, content }) {
    const chapterId = await run(
      () => addChapter(id, { chapterTitle, content, authorId: user.uid }),
      { success: "Chapter published." }
    );
    if (chapterId) {
      // Land on the chapter list so the author sees the new entry in sequence.
      navigate(`/update-chapter-list/${id}`);
    }
  }

  if (loading) return <LoadingState label="Loading series…" />;

  if (!story) {
    return (
      <div className="page-background">
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
      <div className="page-background">
        <EmptyState
          icon="fa-lock"
          title="Not your series"
          message="You can only add chapters to series that you published."
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
        / <Link to="/my-series">My Series</Link> / <span>New Chapter</span>
      </div>

      <div className="addchapter-container">
        <div className="addchapter-header">
          <h1>Create New Chapter</h1>
          <hr />
        </div>

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

        {story.totalChapters > 0 && (
          <InlineMessage tone="info">
            This will be chapter {story.totalChapters + 1} in <strong>{story.title}</strong>.
          </InlineMessage>
        )}

        <div className="chapter-form">
          <h2>New Chapter Details</h2>
          <ChapterEditor
            submitLabel={busy ? "Publishing…" : "Publish chapter"}
            busy={busy}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/update-chapter-list/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
