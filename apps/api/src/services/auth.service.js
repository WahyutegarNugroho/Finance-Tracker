const { db, auth } = require('../config/firebase');
const { admin } = require('../config/firebase');

const USERS_COLLECTION = 'users';

/**
 * Default categories seeded for new users
 */
const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: 'restaurant', color: '#4648d4', type: 'expense' },
  { name: 'Transportation', icon: 'directions_car', color: '#8b5cf6', type: 'expense' },
  { name: 'Groceries', icon: 'shopping_cart', color: '#ec4899', type: 'expense' },
  { name: 'Rent & Utilities', icon: 'home', color: '#f59e0b', type: 'expense' },
  { name: 'Entertainment', icon: 'sports_esports', color: '#c7c4d7', type: 'expense' },
  { name: 'Healthcare', icon: 'local_hospital', color: '#ef4444', type: 'expense' },
  { name: 'Shopping', icon: 'shopping_bag', color: '#06b6d4', type: 'expense' },
  { name: 'Salary', icon: 'payments', color: '#006c49', type: 'income' },
  { name: 'Freelance', icon: 'work', color: '#10b981', type: 'income' },
  { name: 'Investment', icon: 'trending_up', color: '#6366f1', type: 'income' },
];

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

  // Create user document in Firestore
  const userData = {
    displayName,
    email,
    photoURL: null,
    currency: 'IDR',
    darkMode: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(userData);

    // Seed default categories
    const batch = db.batch();
    for (const category of DEFAULT_CATEGORIES) {
      const catRef = db.collection('categories').doc();
      batch.set(catRef, {
        ...category,
        userId: uid,
        isDefault: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();

    return { ...userData, uid, isNewUser: true };
  }

  // Existing user — update last login info
  await userRef.update({
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { uid, ...userDoc.data(), isNewUser: false };
};

/**
 * Get user profile from Firestore
 */
const getUserProfile = async (uid) => {
  const userDoc = await db.collection(USERS_COLLECTION).doc(uid).get();

  if (!userDoc.exists) {
    return null;
  }

  return { uid, ...userDoc.data() };
};

module.exports = {
  registerUser,
  handleGoogleSignIn,
  getUserProfile,
  DEFAULT_CATEGORIES,
};
