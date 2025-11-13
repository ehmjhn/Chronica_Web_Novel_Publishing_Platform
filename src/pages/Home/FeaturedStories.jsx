import './home.css';
import { useState, useEffect } from 'react';
import { readComic, retrieveUsers } from '../../firebase/db';
import StoryCard from '../../components/StoryCard';

function FeaturedStories() {
  const [featuredComics, setFeatured] = useState([]);

  useEffect(() => {
    let usersList = [];

    const unsubscribeUsers = retrieveUsers((users) => {
      usersList = users;
    });

    const unsubscribeComics = readComic((comics) => {
      if (!comics) return;

      const featured = comics
        .filter(comic => comic.isFeatured)
        .map(comic => {

          const author = usersList.find(u => u.id === comic.authorId);
          return {
            ...comic,
            authorName: author?.displayName || "Unknown",
          };
        });

      setFeatured(featured);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeComics();
    };
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
              author={comic.authorName}
              coverImage={comic.coverImage || ""}
              views={comic.views || 0}
              rate={comic.rate || 0}
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
