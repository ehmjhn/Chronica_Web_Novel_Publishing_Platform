import "./home.css";

import { readComic } from "../../firebase/db.js";
import { useEffect, useState } from "react";

import StoryCard from "../../components/StoryCard.jsx";

function LatestStories() {
  const [latestComics, setLatest] = useState([]);

  useEffect(() => {
    readComic((Comics) => {
      const today = new Date();
      const latest = Comics.filter((comic) => {
        if (!comic.createdAt) return false;
        const createdDate = new Date(comic.createdAt);
        const diffDays = (today - createdDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 30; 
      });

      latest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatest(latest);
    });
  }, [])

  return (
    <div className="latest-content">
      <h1>Latest Releases</h1>
      <div className="latest-page">
        {latestComics.length > 0 ? (
          latestComics.map((comic) => (
            <StoryCard
              key={comic.id}
              storyId={comic.id}
              title={comic.title}
              author={comic.author || "Unknown"}
              coverImage={comic.coverImage?.coverImage || comic.coverImage || ""}
              views={comic.views?.views || comic.views || 0}
              rate={comic.rate?.rate || comic.rate || 0}
              isFeatured={comic.isFeatured || false}
              showFeatured={false}
            />
          ))
        ) : (
          <p className="no-comics">No new releases available.</p>
        )}
      </div>
    </div>
  );
}

export default LatestStories;
