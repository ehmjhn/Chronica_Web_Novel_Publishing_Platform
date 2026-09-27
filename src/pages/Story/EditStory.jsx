import { Link, useNavigate, useParams } from "react-router";
import StoryForm from "../../components/StoryForm";
import { EmptyState, LoadingState } from "../../components/States";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { getStory, updateStory } from "../../firebase/db";

export default function EditStory() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { run, busy } = useAsyncAction();

  const { data: story, loading } = useAsyncData(() => getStory(id), [id]);

  async function handleSubmit(values) {
    const result = await run(() => updateStory(id, values), { success: "Series updated." });
    if (result) navigate("/my-series");
  }

  if (loading) return <LoadingState label="Loading series…" />;

  if (!story) {
    return (
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
    );
  }

  if (story.authorId !== user?.uid) {
    // Don't confirm the series exists to someone who doesn't own it.
    return (
      <EmptyState
        icon="fa-lock"
        title="Not your series"
        message="You can only edit series that you published."
        action={
          <Link to="/my-series" className="btn btn-gray">
            Back to My Series
          </Link>
        }
      />
    );
  }

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <Link to="/my-series">My Series</Link> / <span>Update Story</span>
      </div>

      <div className="create-form-page">
        <div className="series-chapter-link">
          <Link to={`/update-story/${id}`}>Series Details</Link>
          <Link to={`/update-chapter-list/${id}`}>Chapter List</Link>
        </div>

        <h2 className="create-form-title">Edit Story</h2>

        {/* key remounts the form once the series is loaded, so the draft is
            seeded from stored values instead of blank defaults. */}
        <StoryForm
          key={story.id}
          initial={{
            title: story.title || "",
            synopsis: story.synopsis || "",
            status: story.status || "Ongoing",
            copyright: story.copyright || "All Rights Reserved",
            contentWarning: story.contentWarning || "None",
            genre: story.genre || [],
            tags: story.tags || [],
            coverImage: story.coverImage || "",
          }}
          submitLabel="Save changes"
          busy={busy}
          onSubmit={handleSubmit}
        />

        <p className="muted">
          {story.totalChapters || 0} chapter{(story.totalChapters || 0) === 1 ? "" : "s"} published.{" "}
          <Link to={`/story-details/${id}`}>Preview this series →</Link>
        </p>
      </div>
    </div>
  );
}
