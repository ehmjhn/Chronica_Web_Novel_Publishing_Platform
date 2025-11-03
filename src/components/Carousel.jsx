import React, { useState, useEffect } from 'react';
import './components.css';

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || !slides || slides.length === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, slides]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div 
      className="carousel"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <button 
        className="carousel-button carousel-button-prev" 
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="carousel-slides">
        <div
          className="carousel-slide active"
          style={{
            backgroundImage: currentSlide.image ? `url(${currentSlide.image})` : 'none',
          }}
        >
          <div className="carousel-overlay"></div>
          <div className="carousel-content">
            <h2 className="carousel-title">{currentSlide.title}</h2>
            <p className="carousel-description">{currentSlide.description}</p>
            <div className="carousel-meta">
              <span className="carousel-author">by {currentSlide.author}</span>
              <span className="carousel-category">{currentSlide.category}</span>
            </div>
            <button className="carousel-cta">Read Now</button>
          </div>
        </div>
      </div>

      <button 
        className="carousel-button carousel-button-next" 
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;