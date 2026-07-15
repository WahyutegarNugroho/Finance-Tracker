const { db } = require('../config/firebase');
const { now } = require('../utils/firestore');
const { calculateNextRecurringDate } = require('../utils/recurring');
const logger = require('../utils/logger');

const COLLECTION = 'transactions';

const processDueTransactions = async (userId) => {
  const nowDate = new Date();
  const dueQuery = userId
    ? db.collection(COLLECTION)
        .where('userId', '==', userId)
        .where('isRecurring', '==', true)
        .where('recurringNextDate', '<=', nowDate)
    : db.collection(COLLECTION)
        .where('isRecurring', '==', true)
        .where('recurringNextDate', '<=', nowDate)
        .limit(500);

  const snapshot = await dueQuery.get();
  if (snapshot.empty) return { processed: 0 };

  let processed = 0;
  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.recurringEndDate && new Date(data.recurringEndDate) < nowDate) {
      return;
    }

    const newRef = db.collection(COLLECTION).doc();
    const nextDate = calculateNextRecurringDate(data.recurringNextDate.toDate(), data.recurringFrequency);

    batch.set(newRef, {
      userId: data.userId,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      categoryIcon: data.categoryIcon,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      note: data.note,
      date: data.recurringNextDate,
      isRecurring: false,
      tags: data.tags || [],
      createdAt: now(),
      updatedAt: now(),
    });

    batch.update(doc.ref, {
      recurringNextDate: nextDate,
      updatedAt: now(),
    });

    processed++;
  });

  if (processed > 0) {
    await batch.commit();
  }

  logger.info({ userId, processed }, 'Recurring transactions processed');
    return { processed };
};

const processAllDueTransactions = async () => {
  return processDueTransactions(null);
};

module.exports = {
  processDueTransactions,
  processAllDueTransactions,
};
