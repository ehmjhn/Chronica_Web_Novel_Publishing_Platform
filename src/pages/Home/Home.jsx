import './home.css';
import JZ from '../../assets/NovelBG.png';

import { useEffect, useState } from 'react';
import { getComicList } from "../../firebase/db.js";

import Carousel from '../../components/Carousel.jsx';
import StorySection from '../../components/StorySection.jsx';

function Home() {
  const [featuredStories, setFeaturedStories] = useState([]); 
  const [latestStories, setLatestStories] = useState([]);
  const [popularWorks, setPopularWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselSlides = [
    {
      image: JZ,
      title: 'Featured Story',
      description: 'Discover amazing stories from talented authors',
      author: 'Author Name',
      category: 'Adventure'
    },
    {
      image: '',
      title: 'Latest Release',
      description: 'Read the newest chapters and series',
      author: 'Author Name',
      category: 'Romance'
    },
    {
      image: '',
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
    {
      image: '',
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
    {
      image: '',
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
  ];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const comics = await getComicList();

      // Example processing
      setFeaturedStories(comics.filter(c => c.isFeatured));
      setLatestStories(comics
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
      );
      setPopularWorks(comics
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
      );

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Carousel slides={carouselSlides} />

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
