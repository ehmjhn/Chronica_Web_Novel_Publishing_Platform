import { NavLink, useParams } from 'react-router';
import {useState,useEffect} from 'react';
import { readComic, retrieveChapter } from '../../firebase/db';
import './story.css';

function StoryView() {

    const {id} = useParams(); //story id
    const [story, setStory] = useState(null);
    const [firstChapter, setChapter] = useState([]);

  
    useEffect(() => {
      readComic((stories) => {
        const story = stories.find(s=> s.id === id)
        setStory(story)

        if(story){
          retrieveChapter((chaps)=>{
            const storyChaps = chaps
              .filter(c=> c.storyId === id)
              .sort((a, b) => a.order - b.order);

            if(storyChaps.length > 0){
              const latestChapter = storyChaps[0]; 
              setChapter(latestChapter);
            }
          })
        }

      });
  
    }, [id]);  

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
              <button className="btn download">
                <i className="fa-solid fa-bookmark"></i>Bookmark
              </button>
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
