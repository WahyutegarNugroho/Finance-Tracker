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
const SEED_EMAIL = process.argv[2] || process.env.SEED_USER_EMAIL || 'demo@fintrack.com';
const SEED_PASSWORD = process.env.SEED_USER_PASSWORD || 'Demo123456!';
const SEED_NAME = 'Wahyu Tegar';

// Sample transaction templates
const EXPENSE_TRANSACTIONS = [
  { catIndex: 0, note: 'Starbucks Reserve Coffee', minAmount: 45000, maxAmount: 85000 },
  { catIndex: 0, note: 'Nasi Padang Sederhana', minAmount: 32000, maxAmount: 58000 },
  { catIndex: 0, note: 'Pizza Hut dinner with team', minAmount: 120000, maxAmount: 240000 },
  { catIndex: 0, note: 'Kopi Kenangan Mantan', minAmount: 22000, maxAmount: 42000 },
  { catIndex: 0, note: 'McDonalds Drive Thru', minAmount: 45000, maxAmount: 110000 },
  { catIndex: 0, note: 'Bakso Solo Samrat', minAmount: 35000, maxAmount: 65000 },
  { catIndex: 1, note: 'GrabCar to Client Office', minAmount: 35000, maxAmount: 75000 },
  { catIndex: 1, note: 'Pertamina Pertamax Turbo', minAmount: 150000, maxAmount: 300000 },
  { catIndex: 1, note: 'GoRide quick trip', minAmount: 14000, maxAmount: 28000 },
  { catIndex: 1, note: 'MRT Jakarta Monthly Pass', minAmount: 150000, maxAmount: 150000 },
  { catIndex: 2, note: 'Indomaret Point snacks & dairy', minAmount: 45000, maxAmount: 180000 },
  { catIndex: 2, note: 'Superindo weekly fresh produce', minAmount: 180000, maxAmount: 450000 },
  { catIndex: 2, note: 'Grand Lucky Imported Groceries', minAmount: 250000, maxAmount: 650000 },
  { catIndex: 3, note: 'PLN Electricity token (Postpaid)', minAmount: 450000, maxAmount: 650000 },
  { catIndex: 3, note: 'Water utility PDAM Tirta', minAmount: 85000, maxAmount: 140000 },
  { catIndex: 3, note: 'Biznet High-Speed Fiber Internet', minAmount: 375000, maxAmount: 375000 },
  { catIndex: 4, note: 'Netflix Premium 4K Family', minAmount: 186000, maxAmount: 186000 },
  { catIndex: 4, note: 'Spotify Individual Plan', minAmount: 54990, maxAmount: 54990 },
  { catIndex: 4, note: 'Cinema XXI IMAX Tickets', minAmount: 110000, maxAmount: 190000 },
  { catIndex: 5, note: 'Kimia Farma vitamins & supplements', minAmount: 65000, maxAmount: 220000 },
  { catIndex: 6, note: 'Tokopedia mechanical keyboard parts', minAmount: 250000, maxAmount: 850000 },
  { catIndex: 6, note: 'Uniqlo AIRism shirts', minAmount: 199000, maxAmount: 499000 },
];

const INCOME_TRANSACTIONS = [
  { catIndex: 7, note: 'Monthly Senior Engineer Salary', minAmount: 14500000, maxAmount: 16000000 },
  { catIndex: 8, note: 'Full-Stack Web App Development (Client)', minAmount: 3500000, maxAmount: 7500000 },
  { catIndex: 8, note: 'UI/UX Design System Consultancy', minAmount: 2500000, maxAmount: 4500000 },
  { catIndex: 9, note: 'Stock Market Dividend (BBCA / BBRI)', minAmount: 450000, maxAmount: 1250000 },
  { catIndex: 9, note: 'Crypto Staking & Yield Return', minAmount: 300000, maxAmount: 950000 },
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
    console.log(`👤 Setting up user ${SEED_EMAIL}...`);
    let userId;
    let userName = SEED_NAME;
    let userPhoto = null;

    try {
      // Try to get existing user
      const existingUser = await auth.getUserByEmail(SEED_EMAIL);
      userId = existingUser.uid;
      if (existingUser.displayName) {
        userName = existingUser.displayName;
      }
      if (existingUser.photoURL) {
        userPhoto = existingUser.photoURL;
      }
      console.log(`   ✓ Found existing user: ${SEED_EMAIL} (${userId}, "${userName}")`);
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
      displayName: userName,
      email: SEED_EMAIL,
      photoURL: userPhoto,
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
    const now = new Date();

    // Generate 12-20 transactions per month for last 6 months
    for (let monthBack = 0; monthBack < 6; monthBack++) {
      const batch = db.batch();
      let batchTxCount = 0;
      const txPerMonth = randomBetween(14, 22);
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthBack, 1);
      const isCurrentMonth = monthBack === 0;
      const maxDay = isCurrentMonth ? Math.max(1, now.getDate()) : 28;

      // Always add salary for each month
      // For current month, salary was received on day 1 or 5
      const salaryDay = isCurrentMonth ? Math.min(maxDay, randomBetween(1, 4)) : randomBetween(25, 28);
      const salaryDate = new Date(
        targetMonth.getFullYear(),
        targetMonth.getMonth(),
        salaryDay,
        9, 0, 0
      );

      const salaryCat = categoryIds[7]; // Salary
      batch.set(db.collection('transactions').doc(), {
        userId,
        categoryId: salaryCat.id,
        categoryName: salaryCat.name,
        categoryIcon: salaryCat.icon,
        type: 'income',
        amount: randomBetween(14500000, 16000000),
        note: 'Monthly Senior Engineer Salary',
        date: salaryDate,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchTxCount++;

      // Add random expense transactions
      for (let i = 0; i < txPerMonth; i++) {
        const template = EXPENSE_TRANSACTIONS[randomBetween(0, EXPENSE_TRANSACTIONS.length - 1)];
        const cat = categoryIds[template.catIndex];
        const day = randomBetween(1, maxDay);
        const hour = randomBetween(8, 21);
        const minute = randomBetween(0, 59);
        const txDate = new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          day,
          hour,
          minute
        );

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

      // Add 1-2 extra income transactions per month (freelance or investments)
      const extraIncome = randomBetween(1, 2);
      for (let i = 0; i < extraIncome; i++) {
        const template = INCOME_TRANSACTIONS[randomBetween(1, INCOME_TRANSACTIONS.length - 1)];
        const cat = categoryIds[template.catIndex];
        const day = randomBetween(1, maxDay);
        const txDate = new Date(
          targetMonth.getFullYear(),
          targetMonth.getMonth(),
          day,
          14,
          30
        );

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

      if (batchTxCount > 0) {
        await batch.commit();
        txCount += batchTxCount;
      }
    }
    console.log(`   ✓ Created ${txCount} transactions (spanning 6 months)`);

    // ─── Step 5: Create budgets for current month ───
    console.log('📊 Creating budgets...');
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Balanced limits to demonstrate Good, Warning, and Critical threshold states
    const budgetData = [
      { catIndex: 0, limit: 1200000 }, // Food & Dining (~75-90% spent -> Warning amber)
      { catIndex: 1, limit: 700000 },  // Transportation (~40-60% spent -> Good sage)
      { catIndex: 2, limit: 1800000 }, // Groceries (~50-70% spent -> Good sage)
      { catIndex: 3, limit: 800000 },  // Rent & Utilities (~100%+ spent -> Critical red)
      { catIndex: 4, limit: 450000 },  // Entertainment (~40-60% spent -> Good sage)
      { catIndex: 5, limit: 350000 },  // Healthcare (~20-40% spent -> Good sage)
      { catIndex: 6, limit: 900000 },  // Shopping (~80-95% spent -> Warning amber)
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
    console.log('👤 Active Account:');
    console.log(`   Name:     ${userName}`);
    console.log(`   Email:    ${SEED_EMAIL}`);
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
