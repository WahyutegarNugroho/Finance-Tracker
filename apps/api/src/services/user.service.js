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

module.exports = { getProfile, updateProfile };
