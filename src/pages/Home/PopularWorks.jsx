import './home.css'
import { readComic, retrieveUsers } from '../../firebase/db';
import { useState, useEffect } from 'react';

import StoryCard from '../../components/StoryCard';

function PopularWorks() {
    const [popularComics, setPopular] = useState([])

    useEffect(()=>{
        let usersList = [];

        const unsubscribeUsers = retrieveUsers((users) => {
            usersList = users;
        });

        const unsubscribeComics = readComic((comics) => {
            if (!comics) return;

            const sorted = [...comics]
                .map((comic) => {
                    const author = usersList.find(u => u.id === comic.authorId);
                    return {
                        ...comic,
                        authorName: author?.displayName || "Unknown",
                    };
                })
                .sort((a, b) => b.views - a.views);

            setPopular(sorted);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeComics();
        };
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
                        author={comic.authorName}
                        coverImage={comic.coverImage || ""}
                        views={comic.views || 0}
                        rate={comic.rate || 0}
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
