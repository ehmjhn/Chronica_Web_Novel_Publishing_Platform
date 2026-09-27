import { Link } from "react-router";
import { formatNumber } from "../lib/format";
import { useStoriesWithAuthors } from "../hooks/useStories";
import { LoadingState, EmptyState } from "./States";
import StoryCard from "./StoryCard";

/**
 * Shared shell for the three catalogue pages. Each one just supplies a
 * selector; sorting, loading and empty states live here.
 */
export function StoryCatalogue({
  title,
  subtitle,
  emptyTitle,
  emptyMessage,
  icon,
  select,
  sort,
}) {
  const { stories, loading } = useStoriesWithAuthors();

  const visible = select(stories);
  const sorted = sort ? [...visible].sort(sort) : visible;

  if (loading) return <LoadingState label={`Loading ${title.toLowerCase()}…`} />;

  return (
    <div className="latest-content">
      <h1>{title}</h1>
      {subtitle && <p className="catalogue-subtitle">{subtitle}</p>}

      <div className="latest-page">
        {sorted.length > 0 ? (
          sorted.map((story) => (
            <StoryCard
              key={story.id}
              storyId={story.id}
              title={story.title}
              author={story.authorName}
              coverImage={story.coverImage}
              views={story.views}
              rate={story.rate}
              isFeatured={story.isFeatured}
              showFeatured={story.isFeatured}
            />
          ))
        ) : (
          <EmptyState
            icon={icon}
            title={emptyTitle}
            message={emptyMessage}
            action={
              <Link to="/create-story" className="btn btn-yellow">
                Become the first to publish
              </Link>
            }
          />
        )}
      </div>

      {sorted.length > 0 && (
        <p className="catalogue-count">
          Showing {formatNumber(sorted.length)} {sorted.length === 1 ? "story" : "stories"}
        </p>
      )}
    </div>
  );
}

export default StoryCatalogue;
