import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import "./story.css";
import StoryView from "./StoryView";
import { EmptyState } from "../../components/States";
import { useToast } from "../../components/toast-context";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getStory, getUserProfile, followUser, unfollowUser, isFollowing } from "../../firebase/db";

export default function StoryDetails() {
  const { id } = useParams();
  const { user } = useAuthUser();
  const toast = useToast();

  const { data: story, loading } = useAsyncData(() => getStory(id), [id]);
  const { data: author } = useAsyncData(
    () => (story?.authorId ? getUserProfile(story.authorId) : null),
    [story?.authorId]
  );

  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    if (!user || !story?.authorId || user.uid === story.authorId) {
      setFollowing(false);
      return;
    }
    let active = true;
    isFollowing(user.uid, story.authorId).then((result) => {
      if (active) setFollowing(result);
    });
    return () => {
      active = false;
    };
  }, [user, story?.authorId]);

  async function toggleFollow() {
    if (!user) {
      toast.info("Please sign in to follow authors.");
      return;
    }
    if (followBusy) return;

    setFollowBusy(true);
    try {
      if (following) {
        await unfollowUser(user.uid, story.authorId);
        setFollowing(false);
        toast.success(`You unfollowed ${author?.displayName || "this author"}.`);
      } else {
        await followUser(user.uid, story.authorId);
        setFollowing(true);
        toast.success(`You are now following ${author?.displayName || "this author"}.`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFollowBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="storyview-page">
        <StoryView />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="storyview-page">
        <StoryView />
        <EmptyState
          icon="fa-triangle-exclamation"
          title="Series not found"
          message="This series may have been removed by its author."
          action={
            <Link to="/search-discovery" className="btn btn-yellow">
              Browse other series
            </Link>
          }
        />
      </div>
    );
  }

  const isOwner = user?.uid === story.authorId;
  const genres = story.genre || [];
  const tags = story.tags || [];

  return (
    <div className="storyview-page">
      <StoryView />

      <section className="storyview-author">
        <h2>About the author</h2>
        <div className="author-details">
          <div className="author-profile">
            {author?.profilePic ? (
              <div className="author-photo">
                <img src={author.profilePic} alt={author.displayName || "Author"} />
              </div>
            ) : (
              <div className="author-photo author-photo--empty" aria-hidden="true">
                <i className="fa-solid fa-user" />
              </div>
            )}

            <Link to={`/author/${story.authorId}`} className="handle">
              {author?.displayName || "Unknown author"}
            </Link>

            <p>
              {author?.followersCount ?? 0} Followers &nbsp;•&nbsp; {author?.followingCount ?? 0} Following
            </p>

            {!isOwner && (
              <button
                type="button"
                className={`btn follow ${following ? "is-following" : ""}`}
                onClick={toggleFollow}
                disabled={followBusy}
              >
                {following ? (
                  <>
                    <i className="fa-solid fa-check" aria-hidden="true" /> Following
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-plus" aria-hidden="true" /> Follow
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="storyview-synopsis">
        <h2>Synopsis</h2>
        <p>{story.synopsis || "This author has not written a synopsis yet."}</p>
      </section>

      {genres.length > 0 && (
        <section className="storyview-genre">
          <h2>Genre</h2>
          <div className="genre-list">
            {genres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <section className="storyview-genre">
          <h2>Tags</h2>
          <div className="genre-list">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>
      )}

      <section className="storyview-warning">
        <h2>Content Warning</h2>
        <span>{story.contentWarning || "None"}</span>
      </section>

      <section className="storyview-warning">
        <h2>Copyright</h2>
        <span>{story.copyright || "All Rights Reserved"}</span>
      </section>
    </div>
  );
}
