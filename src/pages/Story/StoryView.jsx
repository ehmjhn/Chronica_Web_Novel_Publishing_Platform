import { NavLink, useParams } from 'react-router';
import {useState,useEffect} from 'react';
import { readComic } from '../../firebase/db';
import './story.css';

function StoryView() {
 

    const {id} = useParams()
    const [viewStory, setView] = useState([]);
    
    useEffect(() => {
      
        readComic(setView)
    
    },[])  

  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story) => {
          console.log(story)
          return (
            <>
            <div className="subnav-control">
              <NavLink to='/home'><i className="fa-solid fa-home"></i></NavLink> /
              <p>Series</p>/
              <p>{story.title}</p>
            </div>
            <div className="storyview-hero">
              <div className="storyview-wrapper">
                <img
                  src="https://fantasy-faction.com/wp-content/uploads/2025/01/image-2.jpeg"
                  alt="Cover"
                  className="storyview-cover"
                />

                <div className="storyview-hero-info">
                  <h1>{story.title}</h1>
                  <p className="meta">100% • Favorites • Chapters</p>

                  <div className="storyview-rating">
                    <i className="fa fa-star star-icon"></i>
                    <span>
                      {story.rating+ "  / " + story.views + " views"}
                    </span>
                  </div>

                  <div className="storyview-buttons">
                    <button className="btn read"><i className="fa-solid fa-book"></i>Read</button>
                    <button className="btn download">
                      <i className="fa-solid fa-bookmark"></i>Bookmark
                    </button>
                  </div>
                </div>
                {/* <NavLink to='/home'>
                  <button className="back">
                    <i className="fa-solid fa-arrow-left"></i> BACK
                  </button>
                </NavLink> */}
              </div>

              <div className="storyview-nav">
                <NavLink to={`/story-details/${id}`}>Overview</NavLink>
                <NavLink to={`/story-chapter-list/${id}`}>Chapter List</NavLink>
                <NavLink to={`/story-reviews/${id}`}>Reviews</NavLink>
              </div>
            </div>
            </>
          );
        })}
    </>
  );
}

export default StoryView;
