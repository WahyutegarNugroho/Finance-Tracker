const { db } = require('../config/firebase');
const { serializeDoc, now, BATCH_LIMIT } = require('../utils/firestore');

const USERS_COLLECTION = 'users';

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

  return serializeDoc(doc);
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

  updateData.updatedAt = now();

  await db.collection(USERS_COLLECTION).doc(uid).update(updateData);

  // Preserve full profile in response — re-fetch is needed here since we
  // don't have the original doc data in scope
  return getProfile(uid);
};

/**
 * Reset all user data (transactions, budgets, custom categories)
 * Uses batched writes to avoid Firestore write rate limits
 */
const logger = require('../utils/logger');

const resetUserData = async (uid) => {
  const collections = ['transactions', 'budgets', 'categories'];
  const results = await Promise.allSettled([
    deleteCollectionInBatches('transactions', uid),
    deleteCollectionInBatches('budgets', uid),
    deleteCollectionInBatches('categories', uid, doc => !doc.data().isDefault),
  ]);

  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    logger.error({ uid, failures: failures.map(f => f.reason) }, 'resetUserData partial failures');
  }

  const statusByCollection = collections.reduce((acc, name, i) => {
    acc[name] = results[i].status;
    return acc;
  }, {});

  return {
    success: failures.length === 0,
    collections: statusByCollection,
    message: failures.length === 0
      ? 'All user data reset successfully.'
      : `Failed to reset: ${failures.length} of ${collections.length} collections.`,
  };
};

module.exports = { getProfile, updateProfile, resetUserData };
