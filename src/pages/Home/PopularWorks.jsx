import './home.css'
import { readComic } from '../../firebase/db';
import { useState, useEffect } from 'react';

import StoryCard from '../../components/StoryCard';

function PopularWorks() {

    const [popularComics, setPopular] = useState([])

    useEffect(()=>{
        readComic((comics)=>{
            if (!comics) return;

            const popular = comics.sort((a, b)=> b.views - a.views);

            setPopular(popular)
        });
    },[])

    return (
        <div className="latest-content">
            <h1>Popular Works</h1>
            <div className="latest-page">
                {popularComics.length > 0 ? (
                popularComics.map((comic) => (
                    <StoryCard
                    key={comic.id}
                    storyId={comic.id}
                    title={comic.title}
                    author={comic.author?.name || comic.author || "Unknown"}
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

export default PopularWorks;
