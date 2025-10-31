import "./home.css";
import { insertComic,readComic } from "../../firebase/db.js";
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from "../../firebase/firebase-config.js";
import StorySection from "../../components/StorySection.jsx";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import  StoryCard from "../../components/StoryCard.jsx";

function LatestStories() {
  const [latestComics, setLatest] = useState([]);

  useEffect(() => {
    readComic((Comics)=>{
      const today = new Date();
      const monthDue = 1

      const latest = Comics.filter((comic)=>{
        if (!comic.createdAt) return false;

        const createdDate = new Date (comic.createdAt);
        const diffMonths = 
          (today.getFullYear() - createdDate.getFullYear()) * 12 +
          (today.getMonth() - createdDate.getMonth());

        return diffMonths < monthDue
      })

      setLatest(latest)

    }); 
  }, []);

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
              author={comic.author?.author || comic.author || "Unknown"}
              coverImage={comic.coverImage?.coverImage || comic.coverImage || ""}
              views={comic.views?.views || comic.views || 0}
              rate={comic.rate?.rate || comic.rate || 0}
              isFeatured={comic.isFeatured || false}
              showFeatured={false}
            />
          ))
        ) : (
          <p className="no-comics">No comics available.</p>
        )}
      </div>
    </div>
  );
}

export default LatestStories;
