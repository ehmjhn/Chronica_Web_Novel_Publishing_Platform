import { useParams } from 'react-router';
import { useEffect,useState } from 'react';
import { readComic, getUserProfile } from '../../firebase/db';
import './story.css'
import StoryView from './StoryView';

function StoryDetails() {

  const {id} = useParams(); //story id
  const [viewStory, setView] = useState([]);
  const [author, setAuthor] = useState()
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeStories = readComic((stories) => {
      setView(stories);

      const story = stories.find((s) => s.id === id);

      if (story) {
        getUserProfile(story.authorId).then((userData) => {
          setAuthor(userData);
          console.log("Author data:", userData); 
        });
      }
      setIsLoading(false)
    });

    return () => unsubscribeStories();
  }, [id]);

  if (loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

  return (
    <>
      {viewStory
        .filter((story) => story.id === id)
        .map((story, k) => {

          return (
            <div className="storyview-page">
              <StoryView key={k}/>

              {/* AUTHOR SECTION */}
              <div className="storyview-author">
                <h2>Story Author Profile</h2>
                <div className="author-details">
                  <div className="author-profile">
                    <div className="author-photo">
                      <img src={author?.profileURL} alt="WOW" />
                    </div>
                    <p className="handle">{author?.displayName}</p>
                    <p>Followers: {author?.followersCount} • Following: {author?.followingCount}</p>
                    <button className="btn follow">+ Follow</button>
                  </div>

                  {/* Possible tanggalin */}
                  {/* <div className="author-stats">
                    <h3>Series Stats</h3>
                    <p>Trending: 1/8</p>
                    <p>Lifetime: 0 word</p>
                    <p>Monthly: 1 word</p>
                    <p>All-time Rank: #1</p>
                    <p>Ongoing: Parable (1): 9/13</p>
                  </div> */}
                </div>
              </div>

              {/* SYNOPSIS */}
              <div className="storyview-synopsis">
                <h2>Synopsis</h2>
                <p>{story.synopsis}</p>
              </div>

              {/* GENRE */}
              <div className="storyview-genre">
                <h2>Genre</h2>
                <div className="genre-list">
                  {
                    story.genre.map((g, k) => (
                      <span key={k}>{g}</span>
                    ))
                  }
                </div>
              </div>

              {/* TAGS */}
              <div className="storyview-genre">
                <h2>Tags</h2>
                <div className="genre-list">
                  {
                    story.tags.map((t, k) => (
                      <span key={k}>{t}</span>
                    ))
                  }
                </div>
              </div>

              {/* CONTENT WARNING */}
              <div className="storyview-warning">
                <h2>Content Warning</h2>
                <span>{story.contentWarning}</span>
              </div>
            </div>
          );
        })}
      
    </>
  );
}

export default StoryDetails;
