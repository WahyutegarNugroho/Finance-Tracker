const { db, auth } = require('../config/firebase');
const { serializeDoc, serverTimestamp } = require('../utils/firestore');
const { DEFAULT_CATEGORIES } = require('../utils/constants');

const USERS_COLLECTION = 'users';

/**
 * Register a new user with email and password
 * Creates Firebase Auth user + Firestore user doc + default categories
 */
const registerUser = async (email, password, displayName) => {
  // Create user in Firebase Auth
  const userRecord = await auth.createUser({
    email,
    password,
    displayName,
    emailVerified: false,
  });

  try {
    // Create user document in Firestore
    const userData = {
      displayName,
      email,
      photoURL: null,
      currency: 'IDR',
      darkMode: false,
      createdAt: now(),
      updatedAt: now(),
    };

    await db.collection(USERS_COLLECTION).doc(userRecord.uid).set(userData);

    // Seed default categories for the new user
    const batch = db.batch();
    for (const category of DEFAULT_CATEGORIES) {
      const catRef = db.collection('categories').doc();
      batch.set(catRef, {
        ...category,
        userId: userRecord.uid,
        isDefault: true,
        createdAt: now(),
        updatedAt: now(),
      });
    }
    await batch.commit();
  } catch (err) {
    // Rollback: delete Firebase Auth user since Firestore side failed
    await auth.deleteUser(userRecord.uid).catch(() => {});
    throw err;
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    displayName: userRecord.displayName,
  };
};

/**
 * Handle Google sign-in
 * If user doc doesn't exist in Firestore, create it with default categories
 */
const handleGoogleSignIn = async (uid, email, displayName, photoURL) => {
  const userRef = db.collection(USERS_COLLECTION).doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // First time Google sign-in — create user doc + seed categories
    const userData = {
      displayName: displayName || email.split('@')[0],
      email,
      photoURL: photoURL || null,
      currency: 'IDR',
      darkMode: false,
      createdAt: now(),
      updatedAt: now(),
    };

    try {
      await userRef.set(userData);

      // Seed default categories
      const batch = db.batch();
      for (const category of DEFAULT_CATEGORIES) {
        const catRef = db.collection('categories').doc();
        batch.set(catRef, {
          ...category,
          userId: uid,
          isDefault: true,
          createdAt: now(),
          updatedAt: now(),
        });
      }
      await batch.commit();
    } catch (err) {
      // Rollback: delete Firestore user doc if categories seed failed
      await userRef.delete().catch(() => {});
      throw err;
    }

    return { ...userData, uid, isNewUser: true };
  }

  // Existing user — update profile + last login
  const profileUpdate = { updatedAt: now() };
  if (displayName) profileUpdate.displayName = displayName;
  if (photoURL) profileUpdate.photoURL = photoURL;
  await userRef.update(profileUpdate);

  return { uid, ...userDoc.data(), ...profileUpdate, isNewUser: false };
};

/**
 * Get user profile from Firestore
 */
const getUserProfile = async (uid) => {
  const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();

  if (!userDoc.exists) {
    return null;
  }

  return serializeDoc(userDoc);
};

module.exports = {
  registerUser,
  handleGoogleSignIn,
  getUserProfile,
  DEFAULT_CATEGORIES,
};
