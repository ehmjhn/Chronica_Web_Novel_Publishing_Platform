import './home.css'
import { useState, useEffect } from 'react';
import { readComic } from '../../firebase/db';

import StoryCard from '../../components/StoryCard';

function FeaturedStories() {
const [comicList, setComicList] = useState([]);

  useEffect(() => {
    readComic(setComicList); 
  }, []);

  return (
    <div className="latest-content">
      <h1>Featured Stories</h1>
      <div className="latest-page">
        {comicList.length > 0 ? (
          comicList.map((comic) => (
            <StoryCard
              key={comic.id}
              storyId={comic.id}
              title={comic.title}
              author={comic.author?.author || comic.author || "Unknown"}
              coverImage={comic.coverImage?.coverImage || comic.coverImage || ""}
              views={comic.views?.views || comic.views || 0}
              rate={comic.rate?.rate || comic.rate || 0}
              isFeatured={comic.isFeatured || false}
              showFeatured={true}
            />
          ))
        ) : (
          <p className="no-comics">No comics available.</p>
        )}
      </div>
    </div>
  );   
}

export default FeaturedStories;
