import { useParams } from 'react-router';
import { useEffect,useState } from 'react';
import { readComic } from '../../firebase/db';
import './story.css'
import StoryView from './StoryView';

function StoryDetails() {

const {id} = useParams();
const [viewStory, setView] = useState([]);

useEffect(() => {
  readComic(setView);
}, []);  


  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story) => {
          console.log(story.author.profilePic)
          return (
            <div className="storyview-page">
              <StoryView />

              {/* AUTHOR SECTION */}
              <div className="storyview-author">
                <h2>Author's Information</h2>
                <div className="author-details">
                  <div className="author-profile">
                    <div className="author-photo">
                      <img src={story.author.profilePic} alt="WOW" />
                    </div>
                    <p className="handle">@handle</p>
                    <p>Followers: 123 • Following: 12</p>
                    <button className="btn follow">+ Follow</button>
                  </div>

                  <div className="author-stats">
                    <h3>Series Stats</h3>
                    <p>Trending: 1/8</p>
                    <p>Lifetime: 0 word</p>
                    <p>Monthly: 1 word</p>
                    <p>All-time Rank: #1</p>
                    <p>Ongoing: Parable (1): 9/13</p>
                  </div>
                </div>
              </div>

              {/* SYNOPSIS */}
              <div className="storyview-synopsis">
                <h2>Synopsis</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore.
                </p>
              </div>

              {/* GENRE */}
              <div className="storyview-genre">
                <h2>Genre</h2>
                <div className="genre-list">
                  <span>Transmigration</span>
                  <span>Slice of Life</span>
                  <span>Romance</span>
                  <span>Action</span>
                  <span>Sci-Fi</span>
                </div>
              </div>

              {/* TAGS */}
              <div className="storyview-genre">
                <h2>Genre</h2>
                <div className="genre-list">
                  <span>Transmigration</span>
                  <span>Slice of Life</span>
                  <span>Romance</span>
                  <span>Action</span>
                  <span>Sci-Fi</span>
                </div>
              </div>

              {/* CONTENT WARNING */}
              <div className="storyview-warning">
                <h2>Content Warning</h2>
                <span>Strong Language</span>
              </div>
            </div>
          );
        })}
      
    </>
  );
}

export default StoryDetails;
