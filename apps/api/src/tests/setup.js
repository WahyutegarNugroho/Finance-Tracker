const path = require('path');

// Load .env for test (Firebase emulator or mock)
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
