import { useEffect, useState } from 'react';
import './chapter.css';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { retrieveChapter, readComic, getUserProfile } from '../../firebase/db';

function ReadChapter() {
  const { id } = useParams(); // chapter ID
  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [author, setAuthor] = useState(null);
  const [chapters, setChapters] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {

    retrieveChapter((chaps) => {
      if (!chaps) return;

      const foundChapter = chaps.find((c) => c.id === id);
      setChapter(foundChapter || null);
      console.log('Current Chapter:', foundChapter);

      if (foundChapter) {
  
        const storyChaps = chaps
          .filter((c) => c.storyId === foundChapter.storyId)
          .sort((a, b) => a.order - b.order); 
        setChapters(storyChaps);

        const index = storyChaps.findIndex((c) => c.id === foundChapter.id);
        setCurrentIndex(index);

        readComic((stories) => {
          if (!stories) return;
          const foundStory = stories.find((s) => s.id === foundChapter.storyId);
          setStory(foundStory || null);
          console.log('Story:', foundStory);

          if (foundStory) {
            getUserProfile(foundStory.authorId).then((userData) => {
              setAuthor(userData);
              console.log('Author:', userData);
            });
          }
        });
      }

      setIsLoading(false)
    });
  }, [id]);

  if (loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1];
      navigate(`/read-chapter/${prevChapter.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      const nextChapter = chapters[currentIndex + 1];
      navigate(`/read-chapter/${nextChapter.id}`);
    }
  };

  return (
    <div className="page-background">
      <div className="read-bg">
        {/* Series Header */}
        <div className="chapter-header">
          <div className="series-cover">
            <img src={story?.coverImage} alt={`${story?.title} Cover`} />
          </div>

          <div className="series-meta">
            <h2 className="series-title">{story?.title}</h2>
            <p className="author">by {author?.displayName}</p>

            <div className="meta-stats">
              <div className="stat">
                <i className="fa-solid fa-eye"></i> {story?.views}
              </div>
              <div className="stat">
                <i className="fa-solid fa-heart"></i> {story?.likes}
              </div>
              <div className="stat rating">
                <i className="fa-solid fa-star"></i> {story?.rate}/10 (wala pang total ratings)
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Title Navigation */}
        <div className="chapter-title">
          <button
            className="nav-btn prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          <h3>{chapter?.chapterTitle}</h3>

          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={currentIndex === chapters.length - 1}
          >
            Next
          </button>
        </div>

        {/* Chapter Content */}
        <div className="chapter-content">
          <p>{chapter?.content}</p>
        </div>

        {/* Footer Navigation */}
        <div className="chapter-footer">
          <button
            className="nav-btn prev"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </button>

          <NavLink to={`/story-chapter-list/${story?.id}`} className="chapter-list-btn">
            Chapter List
          </NavLink>

          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={currentIndex === chapters.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReadChapter;
