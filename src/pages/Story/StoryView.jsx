import { NavLink, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { 
  readComic, 
  retrieveChapter, 
  getUserProfile, 
  updateStoryLikes, 
  updateBookmark, 
  updateStoryViews 
} from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';
import './story.css';

function StoryView() {
  const { id } = useParams(); 
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [firstChapter, setFirstChapter] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthChanges((user) => {
      setCurrentUser(user);

      readComic((stories) => {
        const foundStory = stories.find(s => s.id === id);
        setStory(foundStory);

        if (foundStory) {
          setLikesCount(foundStory.likes || 0);

          retrieveChapter((chaps) => {
            const storyChaps = chaps
              .filter(c => c.storyId === id)
              .sort((a, b) => a.order - b.order);
            setChapters(storyChaps);
            setFirstChapter(storyChaps[0] || null);
          });

          if (user) {
            getUserProfile(user.uid).then(profile => {
              setIsBookmarked(profile?.bookmarkedStories?.includes(foundStory.id) || false);
              setHasLiked(profile?.likedStories?.includes(foundStory.id) || false);

              updateStoryViews(foundStory.id, user.uid, foundStory.authorId).then(newViews => {
                if (newViews) {
                  setStory(prev => ({ ...prev, views: newViews }));
                }
              });
            });
          }
        }
      });
    });

    return () => unsubscribeAuth();
  }, [id]);

  const handleBookmark = () => {
    if (!currentUser) {
      alert("Please log in to bookmark this story.");
      return;
    }

    updateBookmark(currentUser.uid, story.id, () => {
      setIsBookmarked(prev => !prev);
    });
  };

  const handleLike = async () => {
    if (!currentUser) return alert("Please log in to like this story.");

    const newHasLiked = !hasLiked;
    setHasLiked(newHasLiked);
    setLikesCount(prev => newHasLiked ? prev + 1 : prev - 1);

    try {
      const result = await updateStoryLikes(story.id, currentUser.uid, newHasLiked);
      setLikesCount(result.likes);
      setHasLiked(result.hasLiked);
    } catch (err) {
      console.error(err);
      setHasLiked(!newHasLiked);
      setLikesCount(prev => newHasLiked ? prev - 1 : prev + 1);
    }
  };

  return (
    <>
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <p>Series</p>/ 
        <i>{story?.title}</i>
      </div>

      <div className="storyview-hero">
        <div className="storyview-wrapper">
          <img
            src={story?.coverImage || "https://fantasy-faction.com/wp-content/uploads/2025/01/image-2.jpeg"}
            alt="Cover"
            className="storyview-cover"
            
          />

          <div className="storyview-hero-info">
            <h1>{story?.title}</h1>
            <p className="meta">
              <i className="fa-solid fa-book-open"></i> {story?.status} &nbsp;•&nbsp; 
              <span
                onClick={handleLike}
                style={{
                  color: hasLiked ? "red" : "gray",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <i className="fa-solid fa-heart"></i> {likesCount}
              </span> &nbsp;•&nbsp; 
              <i className="fa-solid fa-list"></i> {chapters.length}
            </p>

            <div className="storyview-rating">
              <span>
                <i className="fa fa-star star-icon"></i> {story?.rate} {' '}
              </span>
              <span>
                <i className="fa fa-eye view-icon"></i> {story?.views} views
              </span>
            </div>

            <div className="storyview-buttons">
              {firstChapter ? 
                <NavLink 
                  to={`/read-chapter/${firstChapter.id}`} 
                  className="btn read"
                >
                  <i className="fa-solid fa-book"></i> Read
                </NavLink> :
                <button className='btn read' onClick={() => alert("No published chapter available.")}>Read</button>
              }

              <button 
                className={`btn download ${isBookmarked ? 'bookmarked' : ''}`} 
                onClick={handleBookmark}
              >
                <i className="fa-solid fa-bookmark"></i> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
          </div>
        </div>

        <div className="storyview-nav">
          <NavLink to={`/story-details/${id}`}>Overview</NavLink>
          <NavLink to={`/story-chapter-list/${id}`}>Chapter List</NavLink>
          <NavLink to={`/story-reviews/${id}`}>Reviews</NavLink>
        </div>
      </div>
    </>
  );
}

export default StoryView;
