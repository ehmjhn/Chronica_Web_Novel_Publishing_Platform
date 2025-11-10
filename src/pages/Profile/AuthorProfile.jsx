import './profile.css';
import { useState, useEffect } from "react";
import { subscribeAuthChanges } from '../../firebase/auth';
import { getUserProfile } from '../../firebase/db';
import { NavLink } from "react-router";

function AuthorProfile({ author }) {
  
  const [userData, setUserData] = useState()
  const [loading, setIsLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const SERIES_PER_PAGE = 5;
  
  useEffect(() => {
    const unsubscribe = subscribeAuthChanges((currentUser) => {
      if (currentUser) {

        getUserProfile(currentUser.uid)
        .then((data)=>{
          setUserData(data)
          setIsLoading(false)
        })

      } else {
        setUserData(null)
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  console.log(userData)

  if(loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>

  // sample data for series
  if (!author) {
    author = {
      series: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Series ${i + 1}`,
        cover: `https://placehold.co/140x140?text=Series+${i + 1}`,
        date: `2025-0${(i % 12) + 1}-01`,
        likes: Math.floor(Math.random() * 1000000),
      })),
    };
  }

  // filter stories
  const sortedSeries = [...author.series].sort((a, b) =>
    activeTab === "popular" ? b.likes - a.likes : new Date(b.date) - new Date(a.date)
  );

  const totalPages = Math.ceil(sortedSeries.length / SERIES_PER_PAGE);
  const visibleSeries = sortedSeries.slice((currentPage - 1) * SERIES_PER_PAGE, currentPage * SERIES_PER_PAGE);

  // handling
  const handlePrev = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="author-profile-wrapper">
      <div className="author-page">
        {/* Header */}
        <div className="author-header-section">
          <div className="author-header-left">
            <div className="author-pic">
              <img src={author.avatar} alt={userData?.displayName} />
            </div>
            <div className="author-info">
              <h2 className="author-handle">{userData?.displayName}</h2>
              <p className="author-stats">
                {userData?.totalSeries} Public Series &nbsp;•&nbsp; {userData?.followersCount} Followers &nbsp;•&nbsp; {userData?.followingCount} Following
              </p>
            </div>
          </div>

        </div>

        <hr className="author-divider" />

        {/* Tabs */}
        <div className="author-tabs">
          <button
            className={`author-tab ${activeTab === "popular" ? "active" : ""}`}
            onClick={() => { setActiveTab("popular"); setCurrentPage(1); }}
          >
            Popular Release
          </button>
          <button
            className={`author-tab ${activeTab === "new" ? "active" : ""}`}
            onClick={() => { setActiveTab("new"); setCurrentPage(1); }}
          >
            New Release
          </button>
        </div>

        {/* Series List */}
        <div className="author-series-list">
          {visibleSeries.map(series => (
            <div key={series.id} className="author-series-card">
              <div className="author-series-img">
                <img src={series.cover} alt={series.title} />
              </div>
              <div className="author-series-details">
                <h3 className="author-series-title">{series.title}</h3>
                <p className="author-series-date">Published: {new Date(series.date).toLocaleDateString()}</p>
                <p className="author-series-views">♡ {series.likes.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: "15px", textAlign: "center", display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button className="author-btn" onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
            <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
            <button className="author-btn" onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}

        {/* About */}
        <div className="author-about">
          <h3>About Me</h3>
          <p>{userData?.bio || "--"}</p>
          <p className="author-joined"><strong>Joined:</strong> {userData?.joinedDate || "--"}</p>
        </div>

        {/* Socials */}
        <div className="author-socials">
          <h3>Socials</h3>
          <div className="author-social-icons">
            <a href=''><i className="fab fa-instagram"></i></a>
            <a href=''><i className="fab fa-facebook"></i></a>
            <a href=''><i className="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;
