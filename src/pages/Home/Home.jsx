import './home.css';
import { useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../../firebase/auth.js';

import StorySection from '../../components/StorySection.jsx';


function Home() {
  // const [user, setUser] = useState('')
  const [featuredStories, setFeaturedStories] = useState([]); 
  const [latestStories, setLatestStories] = useState([]);
  const [popularWorks, setPopularWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();

    // onAuthStateChanged(auth, (user)=>{
    //   setUser(user);
    // })

  }, []); 

  const fetchStories = async () => {
    try {
      const mockStory = {
        title: "Title",
        author: "Author Name",
        views: "1k",
        comments: 12
      };

      setFeaturedStories(Array(5).fill(mockStory));
      setLatestStories(Array(5).fill(mockStory));
      setPopularWorks(Array(5).fill(mockStory));

      setLoading(false);

    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage">
      <main className="main-content">
        <StorySection 
          title="Featured Stories" 
          stories={featuredStories} 
          viewAllPath="/home/featured-stories"
        />

        <StorySection 
          title="Latest Release" 
          stories={latestStories} 
          viewAllPath="/home/latest-releases"
        />

        <StorySection 
          title="Popular Works" 
          stories={popularWorks} 
          viewAllPath="/home/popular-works"
        />
      </main>
    </div>
  );
}

export default Home;
