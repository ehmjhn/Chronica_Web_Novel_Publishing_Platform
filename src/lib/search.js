// Search, filter and sort logic for the discovery page.
// Kept out of the component so the rules are in one place and testable.

import { daysSince } from "./format";

const normalise = (value) => String(value ?? "").trim().toLowerCase();

/**
 * @param {object[]} stories        Series to search.
 * @param {object}   criteria
 * @param {string}   criteria.query       Free-text match on title/synopsis/author.
 * @param {string[]} criteria.genres      Any-of match.
 * @param {string[]} criteria.tags        Any-of match.
 * @param {string[]} criteria.warnings    Only series with one of these warnings.
 * @param {string}   criteria.status      Exact match.
 * @param {string}   criteria.sortBy      "views" | "rate" | "likes" | "createdAt" | ""
 * @param {string}   criteria.sortOrder   "asc" | "desc"
 * @param {object}   chapterCounts        storyId -> chapter count.
 */
export function searchStories(stories = [], criteria = {}, chapterCounts = {}) {
  const {
    query = "",
    genres = [],
    tags = [],
    warnings = [],
    status = "",
    sortBy = "",
    sortOrder = "desc",
  } = criteria;

  const term = normalise(query);

  let results = stories.filter((story) => {
    if (term) {
      const haystack = normalise(
        [story.title, story.synopsis, story.authorName, ...(story.genre || []), ...(story.tags || [])].join(" ")
      );
      if (!haystack.includes(term)) return false;
    }

    if (genres.length) {
      const storyGenres = story.genre || [];
      if (!genres.some((genre) => storyGenres.includes(genre))) return false;
    }

    if (tags.length) {
      const storyTags = story.tags || [];
      if (!tags.some((tag) => storyTags.includes(tag))) return false;
    }

    if (warnings.length) {
      const warning = normalise(story.contentWarning);
      if (!warning || warning === "none") return false;
      if (!warnings.some((w) => warning.includes(normalise(w)))) return false;
    }

    if (status && story.status !== status) return false;

    return true;
  });

  if (sortBy) {
    const direction = sortOrder === "asc" ? 1 : -1;
    results = [...results].sort((a, b) => {
      if (sortBy === "createdAt") {
        return (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * direction;
      }
      return ((a[sortBy] || 0) - (b[sortBy] || 0)) * direction;
    });
  }

  return results.map((story) => ({ ...story, chapters: chapterCounts[story.id] || 0 }));
}

export function hasActiveCriteria(criteria = {}) {
  return Boolean(
    criteria.query ||
      criteria.genres?.length ||
      criteria.tags?.length ||
      criteria.warnings?.length ||
      criteria.status
  );
}

export const isRecent = (story, days) => daysSince(story.createdAt) <= days;
