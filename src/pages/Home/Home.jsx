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
      
      readComic((comics)=>{
        if (!comics) return;

        const featured = comics.filter(comic => comic.isFeatured === true)

        const popular = comics.sort((a,b)=> b.views - a.views)

        const today = new Date();
        const latest = comics.filter((comic) => {
          if (!comic.createdAt) return false;
          const createdDate = new Date(comic.createdAt);
          const diffDays = (today - createdDate) / (1000 * 60 * 60 * 24);
          return diffDays <= 30; 
        });

        latest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFeaturedStories(featured)
        setLatestStories(latest)
        setPopularWorks(popular)
      });

      setLoading(false)
  
    },[]);

  const carouselSlides = [
    {
      image: JZ, //ayan jan nakaset
      title: 'Featured Story',
      description: 'Discover amazing stories from talented authors',
      author: 'Author Name',
      category: 'Adventure'
    },
    {
      image: JZ,
      title: 'Latest Release',
      description: 'Read the newest chapters and series',
      author: 'Author Name',
      category: 'Romance'
    },
    {
      image: JZ,
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
    {
      image: JZ,
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
    {
      image: JZ,
      title: 'Popular Works',
      description: 'Explore the most loved stories',
      author: 'Author Name',
      category: 'SciFi'
    },
  ];

  if (loading) {
    return (
      <div className="homepage">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="background">
      <div className="homepage"> 
        <Carousel slides={carouselSlides} />

        <main className="main-content">
          <StorySection 
            title="Featured Stories" 
            stories={featuredStories} 
            viewAllPath="/home/featured-stories"
            showFeaturedBadge={true}
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
    </div>
  );
}

export default Home;
