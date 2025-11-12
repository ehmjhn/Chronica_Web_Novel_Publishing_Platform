// db.js
import { getDatabase, get, ref, set, push, onValue, update, remove } from "firebase/database";
import { app } from "./firebase-config.js";

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


// update user profile
export const updateUserProfile = (uid, newData) => {
  const userRef = ref(database, `users/${uid}`);
  try {
    return update(userRef, newData);
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
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

//add following
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
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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

