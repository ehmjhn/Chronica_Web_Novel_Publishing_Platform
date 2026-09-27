import "./home.css";
import { useMemo } from "react";
import { daysSince, byNumberDesc, byIdDesc } from "../../lib/format";
import { NEW_RELEASE_WINDOW_DAYS } from "../../lib/constants.js";
import { useStoriesWithAuthors } from "../../hooks/useStories";
import { LoadingState } from "../../components/States";
import Carousel from "../../components/Carousel";
import StorySection from "../../components/StorySection";
import SLIDES from "../../data/carouselSlides";

export default function Home() {
  const { stories, loading } = useStoriesWithAuthors();

  const { featured, latest, popular } = useMemo(() => {
    const published = stories.filter((story) => story.status !== "Hidden");

    return {
      featured: published.filter((story) => story.isFeatured),
      latest: published
        .filter((story) => daysSince(story.createdAt) <= NEW_RELEASE_WINDOW_DAYS)
        .sort(byIdDesc),
      popular: [...published].sort(byNumberDesc("views")),
    };
  }, [stories]);

  if (loading) return <LoadingState label="Loading stories…" />;

  return (
    <div className="homepage">
      <Carousel slides={SLIDES} />

      <div className="main-content">
        <StorySection
          title="Featured Stories"
          stories={featured}
          viewAllPath="/home/featured-stories"
          showFeaturedBadge
          emptyMessage="No featured stories yet — check back soon."
        />
        <StorySection
          title="Latest Release"
          stories={latest}
          viewAllPath="/home/latest-releases"
          emptyMessage={`No stories published in the last ${NEW_RELEASE_WINDOW_DAYS} days.`}
        />
        <StorySection
          title="Popular Works"
          stories={popular}
          viewAllPath="/home/popular-works"
          emptyMessage="No stories have been read yet."
        />
      </div>
    </div>
  );
}
