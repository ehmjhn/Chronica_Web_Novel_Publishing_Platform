import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { readComic, getUserProfile, addFollowerList, deleteFollowerList, checkIfFollowed } from '../../firebase/db';
import './story.css'
import StoryView from './StoryView';
import { subscribeAuthChanges } from '../../firebase/auth';

function StoryDetails() {
  const { id } = useParams();
  const [viewStory, setView] = useState([]);
  const [author, setAuthor] = useState();
  const [authorId, setAuthorId] = useState();
  const [loading, setIsLoading] = useState(true);
  const [user, setCurrentUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState();

  useEffect(() => {
    const unsubscribeStories = readComic((stories) => {
      setView(stories);
      const story = stories.find((s) => s.id === id);
      if (story) {
        setAuthorId(story.authorId);
        getUserProfile(story.authorId).then((userData) => {
          setAuthor(userData);
        });
      }
      setIsLoading(false)
    });

    return () => unsubscribeStories();
  }, [id]);

  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      setCurrentUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (user && authorId) {
      (async () => {
        const result = await checkIfFollowed(user.uid, authorId)
        setIsFollowed(result)
      })()
    }
  }, [user, authorId])

  
  async function handleAddFollow() {
    await addFollowerList(user.uid, authorId);
    setIsFollowed(true);
    setAuthor(prev => ({...prev, followersCount: (prev.followersCount || 0) + 1
    }));
  }
  
  async function handledeleteFollow() {
    await deleteFollowerList(user.uid, authorId);
    setIsFollowed(false);
    setAuthor(prev => ({...prev, followersCount: Math.max((prev.followersCount || 1) - 1, 0)
    }));
  }

  if (loading) return <div className="homepage"><div style={{ margin: "0 auto", fontSize: "20px", color: "white" }}>Loading...</div></div>;

  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story, k) => (
          <div className="storyview-page" key={k}>
            <StoryView />

            <div className="storyview-author">
              <h2>Story Author Profile</h2>
              <div className="author-details">
                <div className="author-profile">
                  <div className="author-photo">
                    <img src={author?.profileURL} alt="WOW" />
                  </div>
                  <p className="handle">{author?.displayName}</p>
                  <p>Followers: {author?.followersCount} • Following: {author?.followingCount}</p>
                  {isFollowed
                    ? <button className="btn follow" onClick={handledeleteFollow}>Following</button>
                    : <button className="btn follow" onClick={handleAddFollow}>+ Follow</button>}
                </div>
              </div>
            </div>

            <div className="storyview-synopsis">
              <h2>Synopsis</h2>
              <p>{story.synopsis}</p>
            </div>

            <div className="storyview-genre">
              <h2>Genre</h2>
              <div className="genre-list">
                {story.genre.map((g, k) => <span key={k}>{g}</span>)}
              </div>
            </div>

            <div className="storyview-genre">
              <h2>Tags</h2>
              <div className="genre-list">
                {story.tags.map((t, k) => <span key={k}>{t}</span>)}
              </div>
            </div>

            <div className="storyview-warning">
              <h2>Content Warning</h2>
              <span>{story.contentWarning}</span>
            </div>
          </div>
        ))}
    </>
  );
}

export default StoryDetails;
