/**
 * FinTrack Database Seeder
 * Creates demo user, default categories, sample transactions, and budgets
 * 
 * Usage: node src/seeds/seed.js
 */
/* eslint-disable no-console */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { db, auth, admin } = require('../config/firebase');
const { BATCH_LIMIT } = require('../utils/firestore');
const { DEFAULT_CATEGORIES } = require('../utils/constants');

// ponytail: hardcoded demo credentials → require env vars (crash if unset) for production seed
const SEED_EMAIL = process.env.SEED_USER_EMAIL || 'demo@fintrack.com';
const SEED_PASSWORD = process.env.SEED_USER_PASSWORD || 'Demo123456!';
const SEED_NAME = 'John Doe';

// Sample transaction templates
const EXPENSE_TRANSACTIONS = [
  { catIndex: 0, note: 'Starbucks coffee', minAmount: 35000, maxAmount: 95000 },
  { catIndex: 0, note: 'Nasi Padang Sederhana', minAmount: 25000, maxAmount: 55000 },
  { catIndex: 0, note: 'Pizza Hut dinner', minAmount: 80000, maxAmount: 200000 },
  { catIndex: 0, note: 'Kopi Kenangan', minAmount: 18000, maxAmount: 45000 },
  { catIndex: 0, note: 'McDonalds', minAmount: 40000, maxAmount: 120000 },
  { catIndex: 1, note: 'Grab ride to office', minAmount: 15000, maxAmount: 50000 },
  { catIndex: 1, note: 'Pertamina fuel', minAmount: 50000, maxAmount: 200000 },
  { catIndex: 1, note: 'Gojek ride', minAmount: 12000, maxAmount: 45000 },
  { catIndex: 1, note: 'MRT monthly pass', minAmount: 150000, maxAmount: 150000 },
  { catIndex: 2, note: 'Indomaret groceries', minAmount: 50000, maxAmount: 250000 },
  { catIndex: 2, note: 'Alfamart weekly run', minAmount: 100000, maxAmount: 400000 },
  { catIndex: 2, note: 'Superindo fresh produce', minAmount: 75000, maxAmount: 300000 },
  { catIndex: 3, note: 'PLN electricity bill', minAmount: 200000, maxAmount: 500000 },
  { catIndex: 3, note: 'Water bill PDAM', minAmount: 80000, maxAmount: 150000 },
  { catIndex: 3, note: 'Internet IndiHome', minAmount: 300000, maxAmount: 400000 },
  { catIndex: 4, note: 'Netflix subscription', minAmount: 54000, maxAmount: 186000 },
  { catIndex: 4, note: 'Spotify Premium', minAmount: 54990, maxAmount: 54990 },
  { catIndex: 4, note: 'Cinema XXI tickets', minAmount: 50000, maxAmount: 150000 },
  { catIndex: 5, note: 'Pharmacy medicine', minAmount: 30000, maxAmount: 200000 },
  { catIndex: 6, note: 'Tokopedia electronics', minAmount: 100000, maxAmount: 1500000 },
  { catIndex: 6, note: 'Uniqlo clothes', minAmount: 150000, maxAmount: 600000 },
];

const INCOME_TRANSACTIONS = [
  { catIndex: 7, note: 'TechCorp Inc. monthly salary', minAmount: 8000000, maxAmount: 8500000 },
  { catIndex: 8, note: 'Freelance web development', minAmount: 1500000, maxAmount: 5000000 },
  { catIndex: 8, note: 'UI/UX design project', minAmount: 2000000, maxAmount: 4000000 },
  { catIndex: 9, note: 'Stock dividend', minAmount: 200000, maxAmount: 800000 },
  { catIndex: 9, note: 'Crypto gains', minAmount: 100000, maxAmount: 1000000 },
];


function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function clearCollections(userId) {
  console.log('🧹 Clearing existing data...');

  const collections = ['transactions', 'budgets', 'categories'];

  for (const colName of collections) {
    const snapshot = await db
      .collection(colName)
      .where('userId', '==', userId)
      .get();

    if (!snapshot.empty) {
      const docs = snapshot.docs;
      for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
        const batch = db.batch();
        const chunk = docs.slice(i, i + BATCH_LIMIT);
        chunk.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
      console.log(`   ✓ Cleared ${docs.length} docs from "${colName}"`);
    }
  }

  // Also clear user doc
  await db.collection('users').doc(userId).delete().catch(() => {});
}

async function seed() {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🌱 FinTrack Database Seeder             ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  try {
    // ─── Step 1: Create or get demo user ───
    console.log('👤 Setting up demo user...');
    let userId;

    try {
      // Try to get existing user
      const existingUser = await auth.getUserByEmail(SEED_EMAIL);
      userId = existingUser.uid;
      console.log(`   ✓ Found existing user: ${SEED_EMAIL} (${userId})`);
    } catch {
      // Create new user
      const newUser = await auth.createUser({
        email: SEED_EMAIL,
        password: SEED_PASSWORD,
        displayName: SEED_NAME,
        emailVerified: true,
      });
      userId = newUser.uid;
      console.log(`   ✓ Created new user: ${SEED_EMAIL} (${userId})`);
    }

    // Clear existing data
    await clearCollections(userId);

    // ─── Step 2: Create user document ───
    console.log('📝 Creating user profile...');
    await db.collection('users').doc(userId).set({
      displayName: SEED_NAME,
      email: SEED_EMAIL,
      photoURL: null,
      currency: 'IDR',
      darkMode: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('   ✓ User profile created');

    // ─── Step 3: Create categories ───
    console.log('📂 Seeding categories...');
    const categoryIds = [];

    for (const cat of DEFAULT_CATEGORIES) {
      const docRef = await db.collection('categories').add({
        ...cat,
        userId,
        isDefault: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      categoryIds.push({ id: docRef.id, ...cat });
    }
    console.log(`   ✓ Created ${categoryIds.length} categories`);

    // ─── Step 4: Generate transactions (last 6 months) ───
    console.log('💰 Generating transactions...');
    let txCount = 0;

    // Generate 8-15 transactions per month for last 6 months
    for (let monthBack = 0; monthBack < 6; monthBack++) {
      const batch = db.batch();
      let batchTxCount = 0;
      const txPerMonth = randomBetween(8, 15);
      const now = new Date();
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthBack, 1);

      // Always add salary for each month
      const salaryDate = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        randomBetween(25, 28)
      );
      if (salaryDate <= now) {
        const salaryCat = categoryIds[7]; // Salary
        batch.set(db.collection('transactions').doc(), {
          userId,
          categoryId: salaryCat.id,
          categoryName: salaryCat.name,
          categoryIcon: salaryCat.icon,
          type: 'income',
          amount: randomBetween(8000000, 8500000),
          note: 'TechCorp Inc. monthly salary',
          date: salaryDate,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        batchTxCount++;
      }

      // Add random expense transactions
      for (let i = 0; i < txPerMonth; i++) {
        const template = EXPENSE_TRANSACTIONS[randomBetween(0, EXPENSE_TRANSACTIONS.length - 1)];
        const cat = categoryIds[template.catIndex];
        const txDate = new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          randomBetween(1, 28)
        );

        if (txDate <= now) {
          batch.set(db.collection('transactions').doc(), {
            userId,
            categoryId: cat.id,
            categoryName: cat.name,
            categoryIcon: cat.icon,
            type: 'expense',
            amount: randomBetween(template.minAmount, template.maxAmount),
            note: template.note,
            date: txDate,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          batchTxCount++;
        }
      }

      // Randomly add 1-2 extra income transactions per month
      const extraIncome = randomBetween(0, 2);
      for (let i = 0; i < extraIncome; i++) {
        const template = INCOME_TRANSACTIONS[randomBetween(1, INCOME_TRANSACTIONS.length - 1)];
        const cat = categoryIds[template.catIndex];
        const txDate = new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          randomBetween(1, 28)
        );

        if (txDate <= now) {
          batch.set(db.collection('transactions').doc(), {
            userId,
            categoryId: cat.id,
            categoryName: cat.name,
            categoryIcon: cat.icon,
            type: 'income',
            amount: randomBetween(template.minAmount, template.maxAmount),
            note: template.note,
            date: txDate,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          batchTxCount++;
        }
      }

      if (batchTxCount > 0) {
        await batch.commit();
        txCount += batchTxCount;
      }
    }
    console.log(`   ✓ Created ${txCount} transactions (spanning 6 months)`);

    // ─── Step 5: Create budgets for current month ───
    console.log('📊 Creating budgets...');
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgetData = [
      { catIndex: 0, limit: 800000 },  // Food & Dining
      { catIndex: 1, limit: 300000 },  // Transportation
      { catIndex: 2, limit: 600000 },  // Groceries
      { catIndex: 3, limit: 1000000 }, // Rent & Utilities
      { catIndex: 4, limit: 250000 },  // Entertainment
      { catIndex: 5, limit: 200000 },  // Healthcare
      { catIndex: 6, limit: 500000 },  // Shopping
    ];

    const budgetBatch = db.batch();
    for (const budget of budgetData) {
      const cat = categoryIds[budget.catIndex];
      budgetBatch.set(db.collection('budgets').doc(), {
        userId,
        categoryId: cat.id,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        limitAmount: budget.limit,
        period: 'monthly',
        month: currentMonth,
        year: currentYear,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await budgetBatch.commit();
    console.log(`   ✓ Created ${budgetData.length} budgets for ${currentMonth}/${currentYear}`);

    // ─── Done ───
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('✅ Seeding complete!');
    console.log('');
    console.log('📧 Demo Account:');
    console.log(`   Email:    ${SEED_EMAIL}`);
    console.log(`   Password: ${SEED_PASSWORD}`);
    console.log('');
    console.log(`📊 Data Summary:`);
    console.log(`   Categories:   ${categoryIds.length}`);
    console.log(`   Transactions: ${txCount}`);
    console.log(`   Budgets:      ${budgetData.length}`);
    console.log('═══════════════════════════════════════════');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}
