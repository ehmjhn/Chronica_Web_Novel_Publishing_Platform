import './home.css'
import { useState, useEffect } from 'react';
import { readComic } from '../../firebase/db';

import StoryCard from '../../components/StoryCard';

function FeaturedStories() {
const [featuredComics, setFeatured] = useState([]);

  useEffect(() => {

    const unsubscribe = readComic((comics) => {
      if (!comics) return;

      const featured = comics.filter(comic => comic.isFeatured === true)
      setFeatured(featured)
      
    });

    return () => unsubscribe();

  }, []);

  return (
    <div className="latest-content">
      <h1>Featured Stories</h1>
      <div className="latest-page">
        {featuredComics.length > 0 ? (
          featuredComics.map((comic) => (
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
