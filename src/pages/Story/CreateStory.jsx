import { Link, useNavigate } from "react-router";
import StoryForm from "../../components/StoryForm";
import { LoadingState } from "../../components/States";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { insertStory } from "../../firebase/db";

export default function CreateStory() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { run, busy } = useAsyncAction();

  async function handleSubmit(values) {
    const storyId = await run(
      () => insertStory({ ...values, authorId: user.uid }),
      { success: "Your series has been published." }
    );
    if (storyId) navigate(`/story-details/${storyId}`);
  }

  if (!user) return <LoadingState />;

  return (
    <div className="storyview-page">
      <div className="subnav-control">
        <Link to="/home">
          <i className="fa-solid fa-house" aria-hidden="true" />
        </Link>{" "}
        / <Link to="/my-series">My Series</Link> / <span>Create your Story</span>
      </div>

      <div className="create-form-page">
        <h2 className="create-form-title">Create Series</h2>
        <StoryForm
          submitLabel="Publish series"
          busy={busy}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
