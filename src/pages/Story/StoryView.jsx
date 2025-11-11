import { NavLink, useFormAction, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { readComic, retrieveChapter, addbookmarkedStories, checkBookmark, deleteBookmark } from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';
import './story.css';

function StoryView() {

  const { id } = useParams(); //story id
  const [story, setStory] = useState(null);
  const [firstChapter, setChapter] = useState([]);
  const [user, setCurrentUser] = useState(null)
  const [result, setResult] = useState()
  useEffect(() => {
    readComic((stories) => {
      const story = stories.find(s => s.id === id)
      setStory(story)

      if (story) {
        retrieveChapter((chaps) => {
          const storyChaps = chaps
            .filter(c => c.storyId === id)
            .sort((a, b) => a.order - b.order);

          if (storyChaps.length > 0) {
            const latestChapter = storyChaps[0];
            setChapter(latestChapter);
          }

        })
      }

    });

    const unsubscribe = subscribeAuthChanges((currentUser) => {
      setCurrentUser(currentUser)
    })
    return () => unsubscribe()
  }, [id]);


  async function handleaddBookmark() {
    await addbookmarkedStories(user.uid, id)
    setResult(true)
  }
  async function handleRemoveBookmark() {
    await deleteBookmark(user.uid, id)
    setResult(false)
  }
  useEffect(() => {
    if (user && id) {
      (async () => {
        setResult(checkBookmark(user.uid, id))
      })()
    }

  }, [user, id])

  return (
    <>
      <div className="subnav-control">
        <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
        <p>Series</p>/
        <p>{story?.title}</p>
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
            <p className="meta">100% • Favorites • Chapters</p>

            <div className="storyview-rating">
              <span>
                <i className="fa fa-star star-icon"></i> {story?.rate} {' '}
                <i className="fa fa-eye view-icon"></i> {story?.views} views
              </span>
            </div>

            <div className="storyview-buttons">
              <NavLink to={`/read-chapter/${firstChapter.id}`} className="btn read"><i className="fa-solid fa-book"></i>Read</NavLink>

              {result ? <button className="btn download" onClick={handleRemoveBookmark}>
                <i class="fa-solid fa-circle-check"></i> Bookmarked
              </button> : <button className="btn download" onClick={handleaddBookmark}>
                <i className="fa-solid fa-bookmark"></i> Bookmark
              </button>}
            </div>
          </div>
        </div>

        <div className="storyview-nav">
          <NavLink to={`/story-details/${id}`} >Overview</NavLink>
          <NavLink to={`/story-chapter-list/${id}`}>Chapter List</NavLink>
          <NavLink to={`/story-reviews/${id}`}>Reviews</NavLink>
        </div>
      </div>
    </>
  );
}

export default StoryView;
