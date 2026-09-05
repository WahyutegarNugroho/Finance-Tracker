const { db } = require('../config/firebase');
const { serializeDoc, now, BATCH_LIMIT } = require('../utils/firestore');
const cache = require('../utils/cache');

const COLLECTION = 'categories';

/**
 * Get all categories for a user (including defaults)
 */
const getCategories = async (userId) => {
  const cacheKey = `categories:${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const snapshot = await db
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get();

  const categories = snapshot.docs
    .map((doc) => serializeDoc(doc))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  cache.set(cacheKey, categories, 60 * 1000);
  return categories;
};

/**
 * Create a new category
 */
const createCategory = async (userId, data) => {
  const categoryData = {
    userId,
    name: data.name,
    icon: data.icon || 'category',
    color: data.color || '#4648d4',
    type: data.type || 'expense',
    isDefault: false,
    createdAt: now(),
    updatedAt: now(),
  };

  const docRef = await db.collection(COLLECTION).add(categoryData);
  cache.del(`categories:${userId}`);

  return { id: docRef.id, ...categoryData };
};

/**
 * Update a category
 * Also updates denormalized categoryName/categoryIcon in related transactions
 */
const updateCategory = async (userId, categoryId, data) => {
  const doc = await db.collection(COLLECTION).doc(categoryId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return null;
  }

  const allowedFields = ['name', 'icon', 'color', 'type'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  updateData.updatedAt = now();

  await db.collection(COLLECTION).doc(categoryId).update(updateData);
  cache.del(`categories:${userId}`);

  // Update denormalized data in transactions if name or icon changed
  if (updateData.name || updateData.icon) {
    const txSnapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .where('categoryId', '==', categoryId)
      .limit(2000)
      .get();

    if (!txSnapshot.empty) {
      const txUpdate = {};
      if (updateData.name) txUpdate.categoryName = updateData.name;
      if (updateData.icon) txUpdate.categoryIcon = updateData.icon;

      // Chunk into batches of 500 (parallel) to avoid Firestore batch limit
      const batchPromises = [];
      for (let i = 0; i < txSnapshot.docs.length; i += BATCH_LIMIT) {
        const batch = db.batch();
        const chunk = txSnapshot.docs.slice(i, i + BATCH_LIMIT);
        chunk.forEach((txDoc) => {
          batch.update(txDoc.ref, txUpdate);
        });
        batchPromises.push(batch.commit());
      }
      await Promise.all(batchPromises);
    }
  }

  // Return constructed object instead of re-fetching (saves 1 read)
  return { id: categoryId, ...doc.data(), ...updateData, updatedAt: new Date() };
};

/**
 * Delete a category (with check for associated transactions)
 */
const deleteCategory = async (userId, categoryId) => {
  const doc = await db.collection(COLLECTION).doc(categoryId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return { success: false, reason: 'not_found' };
  }

  // Check if any transactions use this category
  const txSnapshot = await db
    .collection('transactions')
    .where('userId', '==', userId)
    .where('categoryId', '==', categoryId)
    .limit(1)
    .get();

  if (!txSnapshot.empty) {
    return {
      success: false,
      reason: 'has_transactions',
      message: 'Cannot delete category with existing transactions. Delete or reassign transactions first.',
    };
  }

  await db.collection(COLLECTION).doc(categoryId).delete();
  cache.del(`categories:${userId}`);

  return { success: true };
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
