const { admin } = require('../config/firebase');

const fromFirestoreTimestamp = (ts) => {
  if (!ts) return ts;
  return ts.toDate ? ts.toDate() : new Date(ts);
};

const serializeDoc = (doc, extraDateFields = []) => {
  if (!doc.exists) return null;
  const data = doc.data();
  const result = { id: doc.id, ...data };
  const dateFields = ['date', 'createdAt', 'updatedAt', ...extraDateFields];
  for (const field of dateFields) {
    if (result[field] !== undefined) {
      result[field] = fromFirestoreTimestamp(result[field]);
    }
  }
  return result;
};

const mapSnapshot = (snapshot, extraDateFields = []) => {
  return snapshot.docs.map(doc => serializeDoc(doc, extraDateFields));
};

const now = () => admin.firestore.FieldValue.serverTimestamp();

module.exports = {
  fromFirestoreTimestamp,
  serializeDoc,
  mapSnapshot,
  now,
};
