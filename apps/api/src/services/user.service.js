const { db, admin } = require('../config/firebase');

const USERS_COLLECTION = 'users';

/**
 * Get user profile by UID
 */
const getProfile = async (uid) => {
  const doc = await db.collection(USERS_COLLECTION).doc(uid).get();

  if (!doc.exists) {
    return null;
  }

  return { uid, ...doc.data() };
};

/**
 * Update user profile
 */
const updateProfile = async (uid, data) => {
  const allowedFields = ['displayName', 'currency', 'darkMode', 'photoURL'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection(USERS_COLLECTION).doc(uid).update(updateData);

  // Return updated profile
  return getProfile(uid);
};

/**
 * Reset all user data (transactions, budgets, custom categories)
 */
const resetUserData = async (uid) => {
  // Delete transactions
  const txSnapshot = await db.collection('transactions').where('userId', '==', uid).get();
  const txPromises = txSnapshot.docs.map(doc => doc.ref.delete());

  // Delete budgets
  const budgetSnapshot = await db.collection('budgets').where('userId', '==', uid).get();
  const budgetPromises = budgetSnapshot.docs.map(doc => doc.ref.delete());

  // Delete custom categories (where isDefault is not true)
  const categorySnapshot = await db.collection('categories')
    .where('userId', '==', uid)
    .get();
  const categoryPromises = categorySnapshot.docs
    .filter(doc => !doc.data().isDefault)
    .map(doc => doc.ref.delete());

  await Promise.all([...txPromises, ...budgetPromises, ...categoryPromises]);
};

module.exports = { getProfile, updateProfile, resetUserData };
