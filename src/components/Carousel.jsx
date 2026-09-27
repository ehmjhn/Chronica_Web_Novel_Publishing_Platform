import { useCallback, useEffect, useState } from "react";
import "./components.css";
import { NavLink } from "react-router";

const AUTOPLAY_MS = 5000;

const Carousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  const goToNext = useCallback(
    () => setCurrentIndex((index) => (count ? (index + 1) % count : 0)),
    [count]
  );

  const goToPrevious = useCallback(
    () => setCurrentIndex((index) => (count ? (index - 1 + count) % count : 0)),
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = setInterval(goToNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, count, goToNext]);

  // Keep the index valid if the slide list shrinks.
  useEffect(() => {
    if (currentIndex > count - 1) setCurrentIndex(0);
  }, [count, currentIndex]);

  if (!count) return null;

  const slide = slides[currentIndex];

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <button
        type="button"
        className="carousel-button carousel-button-prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="carousel-slides">
        {/* The image is a decorative backdrop, so it is loaded lazily and only
            once the carousel is actually on screen. */}
        <div
          className="carousel-slide active"
          style={slide.image ? { backgroundImage: `url("${slide.image}")` } : undefined}
        >
          <div className="carousel-overlay" />
          <div className="carousel-content">
            <h2 className="carousel-title">{slide.title}</h2>
            <p className="carousel-description">{slide.description}</p>
            <div className="carousel-meta">
              {slide.author && <span className="carousel-author">by {slide.author}</span>}
              {slide.category && <span className="carousel-category">{slide.category}</span>}
            </div>
            <div className="cta-buttons">
              <NavLink to="/create-story" className="carousel-cta">
                Publish Story Now
              </NavLink>
              <NavLink to="/search-discovery" className="carousel-cta">
                Find Story Now
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="carousel-button carousel-button-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="carousel-dots">
        {slides.map((item, index) => (
          <button
            key={item.title || index}
            type="button"
            className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
