import { useMemo } from "react";
import { retrieveChapter } from "../firebase/db";
import { useSubscription } from "./useSubscription";

/** storyId -> chapter count, for the "N ch" label on result cards. */
export function useChapterCounts() {
  const { data } = useSubscription((cb) => retrieveChapter(cb), [], { initial: [] });

  return useMemo(() => {
    const counts = {};
    for (const chapter of data || []) {
      if (!chapter.storyId) continue;
      counts[chapter.storyId] = (counts[chapter.storyId] || 0) + 1;
    }
    return counts;
  }, [data]);
}

/** Chapters of one series, ordered. */
export function useStoryChapters(storyId) {
  const { data, loading } = useSubscription((cb) => retrieveChapter(cb), [storyId], {
    initial: [],
  });

  const chapters = useMemo(() => {
    if (!storyId) return [];
    return (data || [])
      .filter((chapter) => chapter.storyId === storyId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [data, storyId]);

  return { chapters, loading };
}
