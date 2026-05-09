const { db, admin } = require('../config/firebase');

const COLLECTION = 'categories';

/**
 * Get all categories for a user (including defaults)
 */
const getCategories = async (userId) => {
  const snapshot = await db
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
};

/**
 * Get a single category by ID (with ownership check)
 */
const getCategoryById = async (userId, categoryId) => {
  const doc = await db.collection(COLLECTION).doc(categoryId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
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
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection(COLLECTION).add(categoryData);

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

  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection(COLLECTION).doc(categoryId).update(updateData);

  // Update denormalized data in transactions if name or icon changed
  if (updateData.name || updateData.icon) {
    const txSnapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .where('categoryId', '==', categoryId)
      .get();

    if (!txSnapshot.empty) {
      const batch = db.batch();
      const txUpdate = {};
      if (updateData.name) txUpdate.categoryName = updateData.name;
      if (updateData.icon) txUpdate.categoryIcon = updateData.icon;

      txSnapshot.docs.forEach((txDoc) => {
        batch.update(txDoc.ref, txUpdate);
      });

      await batch.commit();
    }
  }

  const updated = await db.collection(COLLECTION).doc(categoryId).get();
  return { id: updated.id, ...updated.data() };
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

  return { success: true };
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
