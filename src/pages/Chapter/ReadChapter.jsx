import './chapter.css';
import { NavLink } from 'react-router-dom';

function ReadChapter() {
  const chapter = {
    id: 1,
    title: 'Chapter 1: Ewan ko',
    seriesTitle: 'Hindi ko Alam ang Title',
    author: 'jaymziee',
    cover:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
    rating: 9.5,
    totalRatings: 122,
    views: '5.2k',
    favorites: '1.1k',
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  };

  return (
    <div className="page-background">
      <div className="read-bg">
        {/* Series Header */}
        <div className="chapter-header">
            <div className="series-cover">
                <img src={chapter.cover} alt={`${chapter.seriesTitle} Cover`} />
            </div>

            <div className="series-meta">
                <h2 className="series-title">{chapter.seriesTitle}</h2>
                <p className="author">by {chapter.author}</p>

                <div className="meta-stats">
                <div className="stat"><i className="fa-solid fa-eye"></i> {chapter.views}</div>
                <div className="stat"><i className="fa-solid fa-heart"></i> {chapter.favorites}</div>
                <div className="stat rating">
                    <i className="fa-solid fa-star"></i> {chapter.rating}/10 ({chapter.totalRatings} ratings)
                </div>
                </div>
            </div>
        </div>

        {/* Chapter Title Navigation */}
        <div className="chapter-title">
            <button className="nav-btn prev">Previous</button>
            <h3>{chapter.title}</h3>
            <button className="nav-btn next">Next</button>
        </div>

        {/* Chapter Content */}
        <div className="chapter-content">
            <p>{chapter.content}</p>
        </div>

        {/* Footer Navigation */}
        <div className="chapter-footer">
            <button className="nav-btn prev">Previous</button>
            <NavLink to="/story-chapter-list" className="chapter-list-btn">
            Chapter List
            </NavLink>
            <button className="nav-btn next">Next</button>
        </div>
      </div>
    </div>
  );
}

export default ReadChapter;
