import './home.css';
import JZ from '../../assets/jz.png';
import { useEffect, useState } from 'react';
import { readComic } from '../../firebase/db.js';

import Carousel from '../../components/Carousel.jsx';
import StorySection from '../../components/StorySection.jsx';

function Home() {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [popularWorks, setPopularWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = readComic((comics) => {

      setFeaturedStories(comics.filter(c => c.isFeatured));

      setPopularWorks([...comics].sort((a, b) => b.views - a.views));

      const today = new Date();
      setLatestStories(
        comics
          .filter(c => c.createdAt && (today - new Date(c.createdAt)) / (1000 * 60 * 60 * 24) <= 30)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );

      setLoading(false);
    });

    return () => unsubscribe(); 

  }, []);

  if (loading) return <div className="homepage"><div style={{margin: "0 auto", fontSize:"20px", color:"white"}}>Loading...</div></div>;

  const slides = [
    { image: JZ, title: 'Start Your Journey', description: 'Create your own story and get featured on our homepage', author: 'Platform Name', category: 'Promotion' },
    { image: JZ, title: 'Featured Story', description: 'Discover amazing stories from talented authors', author: 'Author Name', category: 'Adventure' },
    { image: JZ, title: 'Latest Release', description: 'Read the newest chapters and series', author: 'Author Name', category: 'Romance' },
    { image: JZ, title: 'Popular Works', description: 'Explore the most loved stories', author: 'Author Name', category: 'SciFi' }
  ];

  return (
    <div className="homepage">
      <Carousel slides={slides} />
      <div className="main-content">
        <StorySection title="Featured Stories" stories={featuredStories} viewAllPath="/home/featured-stories" showFeaturedBadge />
        <StorySection title="Latest Release" stories={latestStories} viewAllPath="/home/latest-releases" />
        <StorySection title="Popular Works" stories={popularWorks} viewAllPath="/home/popular-works" />
      </div>
    </div>
  );
}

export default Home;
