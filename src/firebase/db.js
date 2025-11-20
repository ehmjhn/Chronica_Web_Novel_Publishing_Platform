// db.js
import { getDatabase, get, ref, set, push, onValue, update, remove } from "firebase/database";
import { app } from "./firebase-config.js";
import { FaChampagneGlasses } from "react-icons/fa6";

export const database = getDatabase(app);

//get current user profile
export const getUserProfile = (userId) => {
  return get(ref(database, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        return snapshot.val();
      } else {
        console.log("No user data available");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      return null;
    });
};

//get current user stories
export const getUserStories = (userId, callback) => {
  const myStoryRef = ref(database, `stories/`);

  const unsubscribe = onValue(myStoryRef, (snapshot) => {
    const data = snapshot.val() || {};

    const myStories = Object.entries(data)
      .filter(s => s[1].authorId === userId)
      .map(([id, story]) => ({
        id,
        ...story
      }));
    callback(myStories);
  });
  return unsubscribe;
};

//retrieve users
export const retrieveUsers = (callback) => {
  const userRef = ref(database, `users/`);

  const unsubscribe = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
    const user = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(user);
  });

  return unsubscribe;
};

// retrieve stories
export const readComic = (callback) => {
  const comicRef = ref(database, "stories/");

  const unsubscribe = onValue(comicRef, (snapshot) => {
    const data = snapshot.val() || {};
    const comics = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(comics);
  });

  return unsubscribe;
};

// retrieve chapters
export const retrieveChapter = (callback) => {
  const chapRef = ref(database, `chapters/`)

  const unsubscribe = onValue(chapRef, (snapshot) => {
    const data = snapshot.val()
    const chapters = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(chapters);
  });

  return unsubscribe;
};

//retrieve review
export const retrieveReviews = (callback) => {
  const revRef = ref(database, `reviews/`)

  const unsubscribe = onValue(revRef, (snapshot) => {
    const data = snapshot.val()
    const reviews = Object.entries(data).map(([id, value]) => ({
      id,
      ...value
    }));
    callback(reviews)
  });

  return unsubscribe
}

// Retrieve genres
export const retrieveGenres = (callback) => {
  const genreRef = ref(database, "genres/");

  const unsubscribe = onValue(genreRef, (snapshot) => {
    const data = snapshot.val() || [];
    callback(data);
  });

  return unsubscribe;
};

// Retrieve tags
export const retrieveTags = (callback) => {
  const tagRef = ref(database, "tags/");

  const unsubscribe = onValue(tagRef, (snapshot) => {
    const data = snapshot.val() || [];
    callback(data);
  });

  return unsubscribe;
};

// add following
export async function addFollowerList(userId, followedId) {
  try {

    const userRef = ref(database, `users/${userId}/followingList/${followedId}`);
    const userFollowerRef = ref(database, `users/${userId}/followingCount`)
    const userFollowSnapshot = await get(userFollowerRef)
    const userSnapshot = await get(userRef);
    let followingValue = userFollowSnapshot.val()
    const followedRef = ref(database, `users/${followedId}/followersCount`)
    const followedUserSnapshot = await get(followedRef)
    let followerValue = followedUserSnapshot.val()

    if (userSnapshot.exists()) {
      console.log("you already followed this user.")
    }
    else {
      followingValue += 1;
      followerValue += 1;
      await set(followedRef, followerValue)
      await set(userFollowerRef, followingValue)
      await set(userRef, followedId)
      console.log("updated")
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// add review
export const addReview = (reviewData) => {
  const reviewRef = push(ref(database, 'reviews/'));

  set(reviewRef, {
    storyId: reviewData.storyId,
    userId: reviewData.userId,
    topic: reviewData.topic || "",
    message: reviewData.message || "",
    rating: reviewData.rating || 0,
    createdAt: reviewData.createdAt,
    likes: 0
  })
    .then(() => {
      console.log("Review added successfully!");
      updateStoryRate(reviewData.storyId);
    })
    .catch((error) => {
      console.error("Error adding review:", error);
    });
};

// Add comic
export const insertStory = async (
  title,
  authorId,
  genre,
  status,
  synopsis,
  copyright,
  tags,
  contentWarning,
  coverImage
) => {
  const comicRef = ref(database, "stories/");
  const userTotalRef = ref(database, `users/${authorId}/totalSeries`);
  const newRef = push(comicRef);
  const key = newRef.key;

  const comicJSON = {
    title: title,
    coverImage: coverImage || "https://placehold.net/300x200",
    authorId: authorId,
    likes: 0,
    rate: 0,
    copyright: copyright,
    contentWarning: contentWarning,
    isFeatured: Math.random() < 0.5, // randomizer na t or f
    tags: tags,
    synopsis: synopsis,
    genre: genre,
    status: status,
    totalChapters: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0
  };

  try {

    let totalSeries = (await get(userTotalRef)).val() || 0;
    totalSeries += 1;

    await set(newRef, comicJSON);
    await set(userTotalRef, totalSeries);

    return key;
  } catch (error) {
    console.error("Error inserting comic:", error);
  }
};

// update user profile
export const updateUserProfile = (uid, newData) => {
  const userRef = ref(database, `users/${uid}`);
  try {
    return update(userRef, newData);
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

// update comic
export const updateStory = async (
  storyId,
  title,
  authorId,
  genre,
  status,
  synopsis,
  copyright,
  tags,
  contentWarning,
  coverImage
) => {
  const storyRef = ref(database, `stories/${storyId}`);

  try {
    const snapshot = await get(storyRef);
    if (!snapshot.exists()) {
      console.error("Story not found.");
      return null;
    }

    const existingStory = snapshot.val();

    const updatedStory = {
      ...existingStory,
      title: title,
      authorId: authorId,
      coverImage: coverImage || existingStory.coverImage || "https://placehold.net/300x200",
      genre: genre,
      status: status,
      synopsis: synopsis,
      copyright: copyright,
      tags: tags,
      contentWarning: contentWarning,
      updatedAt: new Date().toISOString()
    };

    await set(storyRef, updatedStory);
    return storyId;
  } catch (error) {
    console.error("Error updating story:", error);
    throw error;
  }
};

// update story like
export const updateStoryLikes = async (storyId, userId, liked) => {
  try {
    const storyRef = ref(database, `stories/${storyId}`);
    const userRef = ref(database, `users/${userId}`);

    const storySnap = await get(storyRef);
    const userSnap = await get(userRef);

    const storyData = storySnap.val() || {};
    const userData = userSnap.val() || {};

    const likedBy = new Set(storyData.likedBy || []);
    liked ? likedBy.add(userId) : likedBy.delete(userId);

    const likedStories = new Set(userData.likedStories || []);
    liked ? likedStories.add(storyId) : likedStories.delete(storyId);

    await set(storyRef, { ...storyData, likedBy: [...likedBy], likes: likedBy.size });
    await set(userRef, { ...userData, likedStories: [...likedStories] });

    return { likes: likedBy.size, hasLiked: liked };
  } catch (error) {
    console.error("Error updating story likes:", error);
    throw error;
  }
};

//update story views
export const updateStoryViews = async (storyId, userId, authorId) => {
  try {
    if (!userId || userId === authorId) return false;

    const userRef = ref(database, `users/${userId}/viewedStories`);
    const storyRef = ref(database, `stories/${storyId}`);

    const userSnap = await get(userRef);
    const viewedStories = userSnap.val() || [];

    if (viewedStories.includes(storyId)) return false;

    const newViewedStories = [...viewedStories, storyId];
    await set(userRef, newViewedStories);

    const storySnap = await get(storyRef);
    const storyData = storySnap.val() || {};
    const newViews = (storyData.views || 0) + 1;

    await update(storyRef, { views: newViews });

    return newViews;
  } catch (err) {
    console.error("Error updating story views:", err);
    return false;
  }
};

//update review
export const updateReview = (reviewId, updatedData) => {
  const reviewRef = ref(database, `reviews/${reviewId}`);

  update(reviewRef, updatedData)
    .then(() => {
      console.log("Review updated successfully!");
      updateStoryRate(updatedData.storyId);
    })
    .catch((error) => console.error("Error updating review:", error));
};

//update story rate
export const updateStoryRate = async (storyId) => {
  const snapshot = await get(ref(database, 'reviews/'));
  const reviews = Object.values(snapshot.val() || {}).filter(r => r.storyId === storyId);
  const avg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  await update(ref(database, `stories/${storyId}`), { rate: Number(avg.toFixed(1)) });
};

//update bookmark
export const updateBookmark = (userId, storyId, callback) => {
  get(ref(database, `users/${userId}/bookmarkedStories`))
    .then(snapshot => {
      const bookmarks = snapshot.val() || [];
      const isBookmarked = bookmarks.includes(storyId)
      const updated = isBookmarked
        ? bookmarks.filter(id => id !== storyId)
        : [...bookmarks, storyId];

      set(ref(database, `users/${userId}/bookmarkedStories`), updated)
        .then(() => callback && callback(updated))
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

// update chapter
export const updateChapter = async (chapterId, updatedData) => {
  try {
    const chapterRef = ref(database, `chapters/${chapterId}`);
    const snapshot = await get(chapterRef);

    if (!snapshot.exists()) {
      console.error("Chapter not found.");
      return null;
    }

    const existingChapter = snapshot.val();

    const updatedChapter = {
      ...existingChapter,
      ...updatedData,
      updatedDate: new Date().toISOString()
    };

    await set(chapterRef, updatedChapter);
    console.log("Chapter updated successfully!");
    return chapterId;
  } catch (error) {
    console.error("Error updating chapter:", error);
    throw error;
  }
};

// delete story
export const deleteStory = async (storyId, authorId) => {
  try {
    const storyRef = ref(database, `stories/${storyId}`);
    const userRef = ref(database, `users/${authorId}`);

    const snapshot = await get(storyRef);
    if (!snapshot.exists()) {
      console.error("Story not found.");
      return false;
    }

    const storyData = snapshot.val();

    if (storyData.authorId !== authorId) {
      console.error("Unauthorized: You can only delete your own story.");
      return false;
    }

    await remove(storyRef);
    console.log("Story deleted successfully!");

    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      const totalSeries = userData.totalSeries || 0;

      await update(userRef, {
        totalSeries: totalSeries > 0 ? totalSeries - 1 : 0,
      });
      console.log("User totalSeries updated!");
    }

    return true;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
};

//delete following
export async function deleteFollowerList(userId, followedId) {
  try {
    const userRef = ref(database, `users/${userId}/followingList/${followedId}`);
    const userFollowerRef = ref(database, `users/${userId}/followingCount`)
    const userFollowSnapshot = await get(userFollowerRef)
    const userSnapshot = await get(userRef);
    let followingValue = userFollowSnapshot.val()
    const followedRef = ref(database, `users/${followedId}/followersCount`)
    const followedUserSnapshot = await get(followedRef)
    let followerValue = followedUserSnapshot.val()


    if (userSnapshot.exists()) {
      await remove(userRef, followedId)
      followingValue -= 1;
      followerValue -= 1;
      await set(followedRef, followerValue)
      await set(userFollowerRef, followingValue)
    }
    else {
      console.log("already unfollowed this user.")
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//check if followed
export async function checkIfFollowed(userId, followedId) {
  try {
    const userRef = ref(database, `users/${userId}/followingList/${followedId}`);
    const userSnapshot = await get(userRef)

    if (!userSnapshot.val()) {
      console.log(userSnapshot.val())
      return false
    }
    else {
      console.log(userSnapshot.val())
      return true
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addChapter(
  storyId,
  content,
  chapterTitle
) {
  const storyRef = ref(database, "chapters/");
  const storyTotalChaptersRef = ref(database, `stories/${storyId}/totalChapters`);
  const newRef = push(storyRef);
  const key = newRef.key
  let totalChapters = (await get(storyTotalChaptersRef)).val()
  let order = 0;
  if (totalChapters === 0) {
    order = 1;
  }
  else {
    order = totalChapters + 1;
  }
  const chapterJSON = {
    chapterTitle: chapterTitle,
    storyId: storyId,
    content: content,
    publishStatus: "published",
    publishDate: new Date().toISOString(),
    order: order
  };
  try {
    console.log(chapterJSON)
    await set(newRef, chapterJSON)
    await set(storyTotalChaptersRef, order)
    return key
  } catch (error) {
    console.log(chapterJSON)
    console.error("Error inserting story:", error);
  }
};
export async function deleteChapter(
  storyId,
  chapterId
) {
  const storyRef = ref(database, `chapters/${chapterId}`);
  const storyTotalChaptersRef = ref(database, `stories/${storyId}/totalChapters`);
  let totalChapters = (await get(storyTotalChaptersRef)).val()

  try {
    await remove(storyRef)
    await set(storyTotalChaptersRef, (totalChapters - 1))
    console.log("deleted Successfully")
  }
  catch (error) {
    console.error("Error inserting story:", error);
  }
};

// upload photo
export const uploadProfilePhoto = async (file) => {
  if (!file) return null;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "sample");
  data.append("cloud_name", "dzvwgxnss");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzvwgxnss/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const fileData = await res.json();
    return fileData.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};

// upload cover image
export const uploadCoverImage = async (file) => {
  if (!file) return null;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "sample");
  data.append("cloud_name", "dzvwgxnss");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzvwgxnss/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const fileData = await res.json();
    return fileData.secure_url;
  } catch (err) {
    console.error("Cover upload failed:", err);
    return null;
  }
};

export async function saveOrder(chapters) {
  console.log(chapters)
  var order = 1
  for (const chapter of chapters) {
    const chapterRef = ref(database, `chapters/${chapter.id}/order`);
    await set(chapterRef, order);
    order += 1
  }

}