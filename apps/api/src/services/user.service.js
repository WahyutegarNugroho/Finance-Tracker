const { db, admin } = require('../config/firebase');

const USERS_COLLECTION = 'users';
const BATCH_LIMIT = 500;

/**
 * Delete all documents in a collection for a user in batches of 500
 */
const deleteCollectionInBatches = async (collectionName, uid, filterFn = null) => {
  const snapshot = await db.collection(collectionName).where('userId', '==', uid).get();
  if (snapshot.empty) return;

  const docs = filterFn ? snapshot.docs.filter(filterFn) : snapshot.docs;
  if (docs.length === 0) return;

  for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    const chunk = docs.slice(i, i + BATCH_LIMIT);
    chunk.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
};

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
 * Uses batched writes to avoid Firestore write rate limits
 */
const resetUserData = async (uid) => {
  await Promise.all([
    deleteCollectionInBatches('transactions', uid),
    deleteCollectionInBatches('budgets', uid),
    deleteCollectionInBatches('categories', uid, doc => !doc.data().isDefault),
  ]);
};

module.exports = { getProfile, updateProfile, resetUserData };
