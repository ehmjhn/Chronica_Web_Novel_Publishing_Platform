// Selectors for the Home page catalogues.
//
// These live outside StoryCatalogue.jsx on purpose: a module that exports both
// components and plain functions breaks React Fast Refresh, so the dev server
// stops hot-updating whenever one of them changes.

import { daysSince } from "./format";
import { NEW_RELEASE_WINDOW_DAYS } from "./constants.js";

export const featuredSelect = (stories) => stories.filter((s) => s.isFeatured);

export const latestSelect = (stories) =>
  stories.filter((s) => daysSince(s.createdAt) <= NEW_RELEASE_WINDOW_DAYS);

export const popularSelect = (stories) => stories;
