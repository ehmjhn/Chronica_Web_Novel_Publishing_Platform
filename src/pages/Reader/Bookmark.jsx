import './reader.css';
import { useState, useEffect } from 'react';
import ResultCard from '../../components/ResultCard';
import { getUserProfile, readComic, retrieveChapter, updateBookmark } from '../../firebase/db';
import { subscribeAuthChanges } from '../../firebase/auth';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState(''); 

  useEffect(() => {
    const unsubscribeAuth = subscribeAuthChanges(async (user) => {
      setCurrentUser(user);

      if (!user) {
        setBookmarks([]);
        return;
      }

      const profile = await getUserProfile(user.uid);
      if (!profile?.bookmarkedStories?.length) {
        setBookmarks([]);
        return;
      }

      readComic(async (allStories) => {
        retrieveChapter((chaptersData) => {
          const bookmarkedStories = allStories
            .filter(story => profile.bookmarkedStories.includes(story.id))
            .map(story => {
              const storyChapters = Object.values(chaptersData).filter(c => c.storyId === story.id);
              return {
                ...story,
                chapters: storyChapters.length,
                views: story.views || 0,
                likes: story.likes || 0,
                genres: story.genres || [],
                tags: story.tags || []
              };
            });

          setBookmarks(bookmarkedStories);
        });
      });
    });

    return () => unsubscribeAuth();
  }, []);

  const handleRemoveBook = (id) => {
    if (!currentUser) return;
    updateBookmark(currentUser.uid, id, () => {
      setBookmarks(prev => prev.filter(b => b.id !== id));
    });
  };

  // filter bookmarks search
  const filteredBookmarks = bookmarks.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const totalPages = Math.ceil(filteredBookmarks.length / limit);
  const paginatedBookmarks = filteredBookmarks.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="bookmark-wrap">
      <div className="bookmark-cont">
        <div className="bookmark-settings">
          <h2>Bookmarked Series ({bookmarks.length})</h2>
          <input
            type="text"
            placeholder="Search title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            name="limit"
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1); 
            }}
          >
            {[10, 25, 50, 75, 100].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <hr />

        <div className="results-grid">
          {paginatedBookmarks.length === 0 && <p>No bookmarks found.</p>}
          {paginatedBookmarks.map(book => (
            <ResultCard
              key={book.id}
              {...book}
              isBookmark={true}
              onRemove={handleRemoveBook}
            />
          ))}
        </div>

        <hr />
        <div className="bookmark-pagination">
          <h3>{currentPage}/{totalPages || 1}</h3>
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bookmark;
