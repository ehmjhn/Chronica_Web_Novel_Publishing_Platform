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

    //AYANNN TAMA
  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story) => {
          return (
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
                    <span>{story.rate+ "  / " + story.views + " views"}</span>
                  </div>

                  <div className="storyview-buttons">
                    <button className="btn read">Read</button>
                    <button className="btn download">
                      Ano to Add Bookmark saglit lang
                    </button>
                  </div>
                </div>
              </div>

              {/* NAV TAS IPASA DITO STORY ID SA NAV LINK*/}
              <div className="storyview-nav">
                <NavLink to={`/story-details/${id}`}>Overview</NavLink>
                <NavLink to={`/story-chapter-list`}>Chapter List</NavLink>
                <NavLink to={`/story-reviews`}>Reviews</NavLink>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default StoryView;
