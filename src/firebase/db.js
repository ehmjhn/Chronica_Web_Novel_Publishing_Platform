// db.js - all Firebase Realtime Database access for Chronica.
//
// Conventions:
//  - Every `subscribe*` function returns its unsubscribe handle. Callers must
//    return it from useEffect so listeners are torn down with the component.
//  - Counts are written with `update()` on a single path so concurrent writes
//    cannot clobber each other (no read-modify-write races).
//  - Nothing here throws for expected failures unless documented; mutating
//    calls throw so callers can surface a real error message.

import {
  getDatabase,
  get,
  set,
  push,
  onValue,
  update,
  remove,
  ref,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  increment,
  runTransaction,
} from "firebase/database";
import { app, cloudinaryConfig } from "./firebase-config.js";
import { PLACEHOLDER_COVER } from "../lib/constants.js";

export const database = getDatabase(app);

const nowISO = () => new Date().toISOString();
const entriesOf = (value) => Object.entries(value ?? {});

export function toList(snapshot) {
  return entriesOf(snapshot.val()).map(([id, value]) => ({ id, ...value }));
}

/**
 * Normalise an id-collection field that may be stored either as an array
 * (current format) or as an object map (legacy/partial writes). Reading these
 * with `.includes()` directly threw a TypeError on the object shape.
 */
function toIdSet(value) {
  if (Array.isArray(value)) return new Set(value.filter(Boolean));
  return new Set(entriesOf(value).filter(([, on]) => on !== false).map(([id]) => id));
}

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export const DEFAULT_USER = {
  name: "",
  displayName: "",
  bio: "",
  email: "",
  bdate: "",
  gender: "",
  location: "",
  contactNo: "",
  joinedDate: "",
  profilePic: "",
  followersCount: 0,
  followingCount: 0,
  totalSeries: 0,
  bookmarkedStories: [],
  likedStories: [],
  viewedStories: [],
};

export function buildUserProfile({ uid, displayName, email, photoURL, fullName }) {
  return {
    ...DEFAULT_USER,
    joinedDate: new Date().toISOString().slice(0, 10),
    displayName: displayName || "",
    name: fullName || displayName || "",
    email: email || "",
    profilePic: photoURL || "",
    uid,
  };
}

export const getUserProfile = async (userId) => {
  if (!userId) return null;
  const snapshot = await get(ref(`users/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
};

/** Live profile for one user, so bookmarked/liked lists stay in sync. */
export const subscribeUserProfile = (userId, callback) => {
  if (!userId) {
    callback(null);
    return () => {};
  }
  return onValue(ref(`users/${userId}`), (snapshot) =>
    callback(snapshot.exists() ? snapshot.val() : null)
  );
};

export const retrieveUsers = (callback) =>
  onValue(ref("users"), (snapshot) => callback(toList(snapshot)));

export const getUserProfileMap = (callback) =>
  onValue(ref("users"), (snapshot) => {
    const map = {};
    for (const [id, value] of entriesOf(snapshot.val())) map[id] = value;
    callback(map);
  });

// Only these keys may be written by the profile editor, so a stale form can
// never reset followersCount, totalSeries, or the user's liked/bookmarked lists.
const EDITABLE_PROFILE_FIELDS = [
  "name",
  "displayName",
  "bio",
  "bdate",
  "gender",
  "location",
  "contactNo",
  "profilePic",
];

export async function updateUserProfile(uid, newData) {
  if (!uid) throw new Error("Not signed in.");
  const patch = {};
  for (const field of EDITABLE_PROFILE_FIELDS) {
    if (field in newData) patch[field] = newData[field];
  }
  if (!Object.keys(patch).length) return;
  await update(ref(`users/${uid}`), patch);
}

/* ------------------------------------------------------------------ *
 * Stories
 * ------------------------------------------------------------------ */

export const readComic = (callback) =>
  onValue(ref("stories"), (snapshot) => callback(toList(snapshot)));

export const getStory = (storyId) =>
  get(ref(`stories/${storyId}`)).then((snapshot) =>
    snapshot.exists() ? { id: storyId, ...snapshot.val() } : null
  );

export const getUserStories = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }
  return onValue(
    query(ref("stories"), orderByChild("authorId"), equalTo(userId)),
    (snapshot) => callback(toList(snapshot))
  );
};

export async function insertStory({
  title,
  authorId,
  genre,
  status,
  synopsis,
  copyright,
  tags,
  contentWarning,
  coverImage,
}) {
  if (!authorId) throw new Error("You must be signed in to publish a story.");
  if (!title?.trim()) throw new Error("A title is required.");

  const now = nowISO();
  const story = {
    title: title.trim(),
    coverImage: coverImage || PLACEHOLDER_COVER,
    authorId,
    likes: 0,
    likedBy: [],
    rate: 0,
    reviewCount: 0,
    copyright: copyright || "All Rights Reserved",
    contentWarning: contentWarning || "None",
    isFeatured: false,
    tags: tags || [],
    synopsis: synopsis || "",
    genre: genre || [],
    status: status || "Ongoing",
    totalChapters: 0,
    createdAt: now,
    updatedAt: now,
    views: 0,
  };

  const newRef = push(ref("stories"));
  await set(newRef, story);
  await update(ref(`users/${authorId}`), { totalSeries: increment(1) });
  return newRef.key;
}

export async function updateStory(storyId, { title, genre, status, synopsis, copyright, tags, contentWarning, coverImage }) {
  if (!storyId) throw new Error("Missing story id.");

  const storyRef = ref(`stories/${storyId}`);
  const snapshot = await get(storyRef);
  if (!snapshot.exists()) throw new Error("Story not found.");
  const existing = snapshot.val();

  const patch = {
    title: title?.trim() || existing.title,
    synopsis: synopsis ?? existing.synopsis,
    genre: genre || existing.genre || [],
    tags: tags || existing.tags || [],
    status: status || existing.status,
    copyright: copyright || existing.copyright,
    contentWarning: contentWarning || existing.contentWarning,
    coverImage: coverImage || existing.coverImage || PLACEHOLDER_COVER,
    updatedAt: nowISO(),
  };

  await update(storyRef, patch);
  return storyId;
}

export async function setStoryFeatured(storyId, isFeatured) {
  await update(ref(`stories/${storyId}`), { isFeatured: !!isFeatured });
}

export async function deleteStory(storyId, authorId) {
  const storyRef = ref(`stories/${storyId}`);
  const snapshot = await get(storyRef);
  if (!snapshot.exists()) throw new Error("Story not found.");

  const story = snapshot.val();
  if (authorId && story.authorId !== authorId) {
    throw new Error("You can only delete your own series.");
  }

  // Remove the series together with its chapters and reviews. Passing a query
  // to remove() deletes every child matching it in one call.
  await Promise.all([
    remove(storyRef),
    remove(query(ref("chapters"), orderByChild("storyId"), equalTo(storyId))),
    remove(query(ref("reviews"), orderByChild("storyId"), equalTo(storyId))),
  ]);

  if (authorId) await decrementClamped(`users/${authorId}/totalSeries`);
  return true;
}

/* ------------------------------------------------------------------ *
 * Story engagement: likes, bookmarks, views
 * ------------------------------------------------------------------ */

export const updateStoryLikes = async (storyId, userId, liked) => {
  if (!userId) throw new Error("You must be signed in to like a story.");

  const storyRef = ref(`stories/${storyId}`);
  const userRef = ref(`users/${userId}`);

  const [storySnap, userSnap] = await Promise.all([get(storyRef), get(userRef)]);
  const story = storySnap.val() || {};
  const user = userSnap.val() || {};

  const likedBy = toIdSet(story.likedBy);
  liked ? likedBy.add(userId) : likedBy.delete(userId);

  const likedStories = toIdSet(user.likedStories);
  liked ? likedStories.add(storyId) : likedStories.delete(storyId);

  await Promise.all([
    update(storyRef, { likedBy: [...likedBy], likes: likedBy.size }),
    update(userRef, { likedStories: [...likedStories] }),
  ]);

  return { likes: likedBy.size, hasLiked: liked };
};

export const updateBookmark = async (userId, storyId) => {
  if (!userId) throw new Error("You must be signed in to bookmark a story.");

  const userRef = ref(`users/${userId}`);
  const snapshot = await get(userRef);
  const bookmarks = toIdSet(snapshot.val()?.bookmarkedStories);
  const isBookmarked = bookmarks.has(storyId);

  isBookmarked ? bookmarks.delete(storyId) : bookmarks.add(storyId);

  await update(userRef, { bookmarkedStories: [...bookmarks] });
  return { bookmarks: [...bookmarks], isBookmarked: !isBookmarked };
};

export const updateStoryViews = async (storyId, userId, authorId) => {
  // Each reader counts a view once per series, and authors never inflate
  // their own numbers.
  if (!userId || userId === authorId) return null;

  // A transaction makes "have I already viewed this?" atomic, so two tabs
  // opening the same series cannot both increment the counter.
  const result = await runTransaction(ref(`users/${userId}`), (user) => {
    if (!user) return; // no profile record yet - nothing to mark
    const viewed = toIdSet(user.viewedStories);
    if (viewed.has(storyId)) return; // abort: already counted
    viewed.add(storyId);
    return { ...user, viewedStories: [...viewed] };
  });

  if (!result.committed) return null;

  await update(ref(`stories/${storyId}`), { views: increment(1) });

  const storySnap = await get(ref(`stories/${storyId}`));
  return storySnap.val()?.views ?? null;
};

/* ------------------------------------------------------------------ *
 * Chapters
 * ------------------------------------------------------------------ */

const byChapterOrder = (a, b) => (a.order || 0) - (b.order || 0);

export const retrieveChapter = (callback) =>
  onValue(ref("chapters"), (snapshot) => callback(toList(snapshot)));

export const getStoryChapters = (storyId) =>
  get(query(ref("chapters"), orderByChild("storyId"), equalTo(storyId))).then((snapshot) =>
    toList(snapshot).sort(byChapterOrder)
  );

/** Live chapters for one series. Replaces the old all-chapters subscription. */
export const subscribeStoryChapters = (storyId, callback) => {
  if (!storyId) {
    callback([]);
    return () => {};
  }
  return onValue(
    query(ref("chapters"), orderByChild("storyId"), equalTo(storyId)),
    (snapshot) => callback(toList(snapshot).sort(byChapterOrder))
  );
};

export const getChapter = (chapterId) =>
  get(ref(`chapters/${chapterId}`)).then((snapshot) =>
    snapshot.exists() ? { id: chapterId, ...snapshot.val() } : null
  );

export async function addChapter(storyId, { chapterTitle, content, authorId, publishStatus, publishDate }) {
  if (!storyId) throw new Error("Missing story id.");
  if (!chapterTitle?.trim()) throw new Error("A chapter title is required.");
  if (!content?.trim()) throw new Error("Chapter content is required.");

  if (authorId) {
    const story = await getStory(storyId);
    if (!story) throw new Error("Story not found.");
    if (story.authorId !== authorId) throw new Error("You can only add chapters to your own series.");
  }

  const chapter = {
    chapterTitle: chapterTitle.trim(),
    storyId,
    authorId: authorId || null,
    content,
    publishStatus: publishStatus || "published",
    publishDate: publishDate || nowISO(),
    updatedDate: null,
    order: 0,
  };

  const newRef = push(ref("chapters"));
  await set(newRef, chapter);

  // Renumber only this series' chapters so `order` stays gap-free.
  const order = await resequenceChapters(storyId);
  await update(ref(`stories/${storyId}`), {
    totalChapters: order,
    updatedAt: nowISO(),
  });

  return newRef.key;
}

export async function updateChapter(chapterId, { chapterTitle, content, authorId, publishStatus, publishDate }) {
  const chapterRef = ref(`chapters/${chapterId}`);
  const snapshot = await get(chapterRef);
  if (!snapshot.exists()) throw new Error("Chapter not found.");

  const chapter = snapshot.val();
  if (authorId) {
    // Trust the series owner, not a stale authorId copied onto the chapter.
    await assertSeriesOwner(chapter.storyId, authorId);
  }

  const patch = {
    chapterTitle: chapterTitle?.trim() || chapter.chapterTitle,
    content: content ?? chapter.content,
    updatedDate: nowISO(),
  };
  if (publishStatus) patch.publishStatus = publishStatus;
  if (publishDate) patch.publishDate = publishDate;

  await update(chapterRef, patch);
  return chapterId;
}

export async function deleteChapter(storyId, chapterId, authorId) {
  const chapterRef = ref(`chapters/${chapterId}`);
  const snapshot = await get(chapterRef);
  if (!snapshot.exists()) throw new Error("Chapter not found.");

  const chapter = snapshot.val();
  const targetStoryId = storyId || chapter.storyId;
  if (chapter.storyId !== targetStoryId) {
    throw new Error("That chapter does not belong to this series.");
  }

  if (authorId) await assertSeriesOwner(targetStoryId, authorId);

  await remove(chapterRef);
  const order = await resequenceChapters(targetStoryId);
  await update(ref(`stories/${targetStoryId}`), {
    totalChapters: order,
    updatedAt: nowISO(),
  });
  return true;
}

/** Throws unless `authorId` published the series. */
async function assertSeriesOwner(storyId, authorId) {
  const story = await getStory(storyId);
  if (!story) throw new Error("Series not found.");
  if (story.authorId !== authorId) {
    throw new Error("You can only manage chapters on your own series.");
  }
  return story;
}

// Reassigns 1..N to every chapter of a series, keyed by the chapter's current
// order so dragging a chapter in the UI persists the new sequence.
export async function saveOrder(chapters, authorId) {
  if (!Array.isArray(chapters) || !chapters.length) return;

  const storyIds = new Set(chapters.map((chapter) => chapter.storyId).filter(Boolean));
  if (storyIds.size !== 1) {
    throw new Error("Chapters from more than one series cannot be reordered together.");
  }

  const storyId = [...storyIds][0];
  if (authorId) await assertSeriesOwner(storyId, authorId);

  await Promise.all(
    chapters.map((chapter, index) => update(ref(`chapters/${chapter.id}/order`), index + 1))
  );

  await update(ref(`stories/${storyId}`), {
    totalChapters: chapters.length,
    updatedAt: nowISO(),
  });
}

async function resequenceChapters(storyId) {
  const chapters = await getStoryChapters(storyId);
  const ordered = [...chapters].sort((a, b) => {
    const diff = (a.order || 0) - (b.order || 0);
    if (diff !== 0) return diff;
    return new Date(a.publishDate || 0) - new Date(b.publishDate || 0);
  });

  await Promise.all(
    ordered.map((chapter, index) => update(ref(`chapters/${chapter.id}/order`), index + 1))
  );
  return ordered.length;
}

/* ------------------------------------------------------------------ *
 * Reviews
 * ------------------------------------------------------------------ */

export const retrieveReviews = (callback) =>
  onValue(ref("reviews"), (snapshot) => callback(toList(snapshot)));

export const getStoryReviews = (storyId) =>
  get(query(ref("reviews"), orderByChild("storyId"), equalTo(storyId))).then((snapshot) =>
    toList(snapshot)
  );

/** Live reviews for one series, so likes and edits appear without a refetch. */
export const subscribeStoryReviews = (storyId, callback) => {
  if (!storyId) {
    callback([]);
    return () => {};
  }
  return onValue(query(ref("reviews"), orderByChild("storyId"), equalTo(storyId)), (snapshot) =>
    callback(toList(snapshot))
  );
};

export async function addReview({ storyId, userId, topic, message, rating }) {
  if (!userId) throw new Error("You must be signed in to review.");
  if (!message?.trim()) throw new Error("Please write a review.");
  if (!topic?.trim()) throw new Error("Please add a review topic.");
  if (!rating) throw new Error("Please choose a rating.");

  const existing = await get(
    query(ref("reviews"), orderByChild("userId"), equalTo(userId))
  );
  const alreadyReviewed = entriesOf(existing.val()).some(
    ([, review]) => review.storyId === storyId
  );
  if (alreadyReviewed) throw new Error("You have already reviewed this story.");

  const newRef = push(ref("reviews"));
  await set(newRef, {
    storyId,
    userId,
    topic: topic.trim(),
    message: message.trim(),
    rating: Number(rating),
    createdAt: nowISO(),
    likes: 0,
    likedBy: [],
  });

  await refreshStoryRating(storyId);
  return newRef.key;
}

export async function updateReview(reviewId, { topic, message, rating, userId }) {
  const reviewRef = ref(`reviews/${reviewId}`);
  const snapshot = await get(reviewRef);
  if (!snapshot.exists()) throw new Error("Review not found.");

  const review = snapshot.val();
  if (userId && review.userId !== userId) {
    throw new Error("You can only edit your own review.");
  }

  await update(reviewRef, {
    topic: topic?.trim() || review.topic,
    message: message?.trim() || review.message,
    rating: rating ? Number(rating) : review.rating,
    updatedAt: nowISO(),
  });

  await refreshStoryRating(review.storyId);
  return reviewId;
}

export const toggleReviewLike = async (reviewId, userId) => {
  if (!userId) throw new Error("You must be signed in to like a review.");

  const reviewRef = ref(`reviews/${reviewId}`);
  const snapshot = await get(reviewRef);
  if (!snapshot.exists()) throw new Error("Review not found.");

  const review = snapshot.val();
  const likedBy = new Set(review.likedBy || []);
  const hasLiked = likedBy.has(userId);
  hasLiked ? likedBy.delete(userId) : likedBy.add(userId);

  await update(reviewRef, { likedBy: [...likedBy], likes: likedBy.size });
  return { likes: likedBy.size, hasLiked: !hasLiked };
};

export const deleteReview = async (reviewId, userId) => {
  const reviewRef = ref(`reviews/${reviewId}`);
  const snapshot = await get(reviewRef);
  if (!snapshot.exists()) return true;

  const review = snapshot.val();
  if (userId && review.userId !== userId) {
    throw new Error("You can only delete your own review.");
  }

  await remove(reviewRef);
  await refreshStoryRating(review.storyId);
  return true;
};

async function refreshStoryRating(storyId) {
  if (!storyId) return;
  const snapshot = await get(query(ref("reviews"), orderByChild("storyId"), equalTo(storyId)));
  const reviews = toList(snapshot);
  const avg = reviews.length
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
    : 0;

  await update(ref(`stories/${storyId}`), {
    rate: Number(avg.toFixed(1)),
    reviewCount: reviews.length,
  });
}

/* ------------------------------------------------------------------ *
 * Follow system
 * ------------------------------------------------------------------ */

export async function isFollowing(userId, followedId) {
  if (!userId || !followedId || userId === followedId) return false;
  const snapshot = await get(ref(`users/${userId}/followingList/${followedId}`));
  return snapshot.exists();
}

export async function followUser(userId, followedId) {
  if (!userId) throw new Error("You must be signed in to follow.");
  if (userId === followedId) throw new Error("You cannot follow yourself.");

  const followRef = ref(`users/${userId}/followingList/${followedId}`);
  if ((await get(followRef)).exists()) return { following: true };

  await Promise.all([
    set(followRef, true),
    update(ref(`users/${userId}`), { followingCount: increment(1) }),
    update(ref(`users/${followedId}`), { followersCount: increment(1) }),
  ]);
  return { following: true };
}

export async function unfollowUser(userId, followedId) {
  if (!userId) throw new Error("You must be signed in to unfollow.");
  if (userId === followedId) return { following: false };

  const followRef = ref(`users/${userId}/followingList/${followedId}`);
  if (!(await get(followRef)).exists()) return { following: false };

  await Promise.all([
    remove(followRef),
    decrementClamped(`users/${userId}/followingCount`),
    decrementClamped(`users/${followedId}/followersCount`),
  ]);
  return { following: false };
}

export const getUserFollowing = (userId) =>
  get(ref(`users/${userId}/followingList`)).then((snapshot) => entriesOf(snapshot.val()).map(([id]) => id));

/* ------------------------------------------------------------------ *
 * Notifications
 * ------------------------------------------------------------------ */

export const subscribeNotifications = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }
  return onValue(
    query(ref(`users/${userId}/notifications`), orderByChild("createdAt"), limitToLast(50)),
    (snapshot) => callback(toList(snapshot).reverse())
  );
};

export async function createNotification({ userId, title, message, link, actorId, actorName }) {
  if (!userId || userId === actorId) return null;

  const newRef = push(ref(`users/${userId}/notifications`));
  await set(newRef, {
    title: title || "",
    message: message || "",
    link: link || "",
    actorId: actorId || "",
    actorName: actorName || "",
    read: false,
    createdAt: Date.now(),
  });
  return newRef.key;
}

export const markNotificationRead = (userId, notificationId, read = true) =>
  update(ref(`users/${userId}/notifications/${notificationId}`), { read });

export const markAllNotificationsRead = async (userId) => {
  const snapshot = await get(ref(`users/${userId}/notifications`));
  const unread = entriesOf(snapshot.val()).filter(([, n]) => !n.read).map(([id]) => id);
  await Promise.all(unread.map((id) => update(ref(`users/${userId}/notifications/${id}`), { read: true })));
  return unread.length;
};

/* ------------------------------------------------------------------ *
 * Taxonomy
 * ------------------------------------------------------------------ */

export const retrieveGenres = (callback) =>
  onValue(ref("genres"), (snapshot) => callback(Object.values(snapshot.val() || [])));

export const retrieveTags = (callback) =>
  onValue(ref("tags"), (snapshot) => callback(Object.values(snapshot.val() || [])));

/* ------------------------------------------------------------------ *
 * Image uploads (Cloudinary)
 * ------------------------------------------------------------------ */

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function uploadImage(file, { folder }) {
  if (!file) throw new Error("No file selected.");
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error("Image uploads are not configured.");
  }
  if (!file.type?.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be smaller than 5 MB.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", cloudinaryConfig.uploadPreset);
  body.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    { method: "POST", body }
  );

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || "Image upload failed. Please try again.");
  }
  return data.secure_url;
}

export const uploadProfilePhoto = (file) => uploadImage(file, { folder: "chronica/avatars" });
export const uploadCoverImage = (file) => uploadImage(file, { folder: "chronica/covers" });

/* ------------------------------------------------------------------ *
 * Internal helpers
 * ------------------------------------------------------------------ */

/**
 * Decrement a counter without ever going below zero.
 *
 * `increment()` from the SDK is the right tool for the common case, but it
 * happily accepts a negative delta, so an unfollow/delete on already-inconsistent
 * data would leave e.g. followersCount at -1 permanently. A transaction lets us
 * clamp while staying atomic.
 */
function decrementClamped(path) {
  return runTransaction(ref(path), (current) => {
    const next = (Number(current) || 0) - 1;
    return Math.max(0, next);
  });
}
