// Shared, app-wide constants.

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const TAGS = [
  "Isekai",
  "Magic",
  "Revenge",
  "School Life",
  "Slice of Life",
  "Time Travel",
  "Villainess",
];

export const STORY_STATUSES = ["Ongoing", "Completed", "Hiatus"];

export const CONTENT_WARNINGS = [
  "None",
  "Gore",
  "Sexual Content",
  "Strong Language",
];

export const COPYRIGHT_OPTIONS = [
  "All Rights Reserved",
  "Public Domain",
  "Creative Commons",
];

export const MAX_GENRES = 7;
export const MAX_TAGS = 7;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100];

export const NEW_RELEASE_WINDOW_DAYS = 30;

export const PLACEHOLDER_COVER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
      <rect width="300" height="420" fill="#1c1a2e"/>
      <text x="150" y="210" fill="#7a6ff0" font-family="Georgia,serif" font-size="30"
        text-anchor="middle" letter-spacing="3">CHRONICA</text>
    </svg>`
  );

export const SORT_OPTIONS = [
  { label: "Page Views", value: "views" },
  { label: "Ratings", value: "rate" },
  { label: "Favorites", value: "likes" },
];
