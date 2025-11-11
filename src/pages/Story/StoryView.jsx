import { NavLink, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { readComic, retrieveChapter, getUserProfile, updateBookmark } from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';
import './story.css';

function StoryView() {
  const { id } = useParams(); 
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [firstChapter, setFirstChapter] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthChanges(async (user) => {
      setCurrentUser(user);

      readComic((stories) => {
        const foundStory = stories.find(story => story.id === id);
        setStory(foundStory);

        if (foundStory) {
          retrieveChapter((chaps) => {
            const storyChaps = chaps
              .filter(c => c.storyId === id)
              .sort((a, b) => a.order - b.order);
            setChapters(storyChaps);
            if (storyChaps.length > 0) setFirstChapter(storyChaps[0]);
          });
        }

        if (user && foundStory) {
          getUserProfile(user.uid).then(profile => {
            setIsBookmarked(profile?.bookmarkedStories?.includes(foundStory.id) || false);
          });
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
            src="https://fantasy-faction.com/wp-content/uploads/2025/01/image-2.jpeg"
            alt="Cover"
            className="storyview-cover"
          />

          <div className="storyview-hero-info">
            <h1>{story?.title}</h1>
            <p className="meta">
              <i className="fa-solid fa-book-open"></i> {story?.status} &nbsp;•&nbsp; 
              <i className="fa-solid fa-heart"></i> {story?.likes} &nbsp;•&nbsp; 
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
              <NavLink 
                to={`/read-chapter/${firstChapter?.id}`} 
                className="btn read"
              >
                <i className="fa-solid fa-book"></i> Read
              </NavLink>

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
