// db.js
import { getDatabase, get, ref, set, push, onValue, update, remove} from "firebase/database";

import { app } from "./firebase-config.js";

export const database = getDatabase(app);

//retrieve your profile
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

// add review
export const addReview = (reviewData, callback) => {
  if (!reviewData) {
    console.log(reviewData)
    console.log(reviewData.storyId)
    console.error("Review data must have an 'id' property");
    return;
  }

  const reviewRef = ref(database, `reviews/${reviewData.userId}`);

  try {
    set(reviewRef, {
      storyId: reviewData.storyId,
      userId: reviewData.userId,
      user: reviewData.user || "",
      topic: reviewData.topic || "",
      text: reviewData.text || "",
      score: reviewData.score || 0,
      createdAt: reviewData.date || new Date().toISOString(),
      likes: reviewData.likes || 0
    });
    // return the review id
  } catch (error) {
    console.error("Error adding review:", error);
  };
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
export const insertComic = (
  title,
  author,
  userID,
  likes,
  rate,
  genre,
  profilePic,
  isCompleted
) => {
  const comicRef = ref(database, "stories/");
  const newRef = push(comicRef);
  try {
    set(newRef, {
      title,
      author: {
        name: author,
        profilePic,
        uid: userID,
      },
      userID,
      likes,
      rate,
      genre,
      isCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error inserting comic:", error);
  }
};

export const updateReview = (reviewId, updatedData) => {
  const reviewRef = ref(database, `reviews/${reviewId}`);

  update(reviewRef, updatedData)
    .then(() => console.log("Review updated successfully!"))
    .catch((error) => console.error("Error updating review:", error));
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
export async function checkIfFollowed(userId, followedId) {
  try {
    const userRef = ref(database, `users/${userId}/followingList/${followedId}`);
    const userSnapshot = get(userRef)


    if (userSnapshot.exists()) {
      return true
    }
    else {
      return false
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

