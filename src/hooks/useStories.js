import { useMemo } from "react";
import { readComic, getUserStories, getUserProfileMap } from "../firebase/db";
import { useSubscription } from "./useSubscription";
import { displayNameOf } from "../lib/format";

/**
 * All series joined with their author.
 *
 * The previous implementation subscribed to `stories` and `users` separately
 * and read `usersList` out of a closure, so whenever users resolved after
 * stories every card was stuck on "Unknown" and never corrected itself.
 * Deriving the join with useMemo from both live lists fixes that.
 */
export function useStoriesWithAuthors() {
  const storiesSub = useSubscription((cb) => readComic(cb), [], { initial: [] });
  const usersSub = useSubscription((cb) => getUserProfileMap(cb), [], { initial: {} });

  const stories = useMemo(() => storiesSub.data || [], [storiesSub.data]);
  const users = useMemo(() => usersSub.data || {}, [usersSub.data]);

  const storiesWithAuthors = useMemo(
    () =>
      stories.map((story) => ({
        ...story,
        authorName: displayNameOf(users[story.authorId]),
        authorProfile: users[story.authorId] || null,
      })),
    [stories, users]
  );

  return {
    stories: storiesWithAuthors,
    loading: storiesSub.loading || usersSub.loading,
    error: storiesSub.error || usersSub.error,
  };
}

/**
 * The signed-in author's own series, for the dashboard.
 *
 * Uses a server-side `orderByChild("authorId")` query rather than filtering the
 * full catalogue, so an author with two series does not download every story
 * in the database (and everyone else's) to find them.
 */
export function useMyStories(userId) {
  const storiesSub = useSubscription(
    (cb) => getUserStories(userId, cb),
    [userId],
    { initial: [] }
  );
  const usersSub = useSubscription((cb) => getUserProfileMap(cb), [], { initial: {} });

  const stories = useMemo(() => storiesSub.data || [], [storiesSub.data]);
  const users = useMemo(() => usersSub.data || {}, [usersSub.data]);

  const mine = useMemo(
    () =>
      stories.map((story) => ({
        ...story,
        authorName: displayNameOf(users[story.authorId]),
      })),
    [stories, users]
  );

  return {
    stories: mine,
    loading: !userId || storiesSub.loading,
    error: storiesSub.error,
  };
}
