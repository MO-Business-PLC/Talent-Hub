#!/usr/bin/env node

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import { seedDatabase, clearDatabase, getDatabaseStats } from '../utils/seedData.js';

// Load environment variables
dotenv.config();

const main = async () => {
  try {
    // Disable indexes during seed to avoid text-index on array error
    process.env.DISABLE_INDEXES = 'true';

    // Connect to database
    await connectDB();
    console.log('📡 Connected to database');

    // Parse command line arguments
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'seed':
        console.log('🌱 Seeding database...');
        const result = await seedDatabase();
        console.log('\n📊 Seeding Results:');
        console.log(`   Users: ${result.users}`);
        console.log(`   Jobs: ${result.jobs}`);
        console.log(`   Applications: ${result.applications}`);
        break;

      case 'clear':
        console.log('🧹 Clearing database...');
        await clearDatabase();
        break;

      case 'stats':
        console.log('📊 Getting database statistics...');
        const stats = await getDatabaseStats();
        console.log('\n📈 Database Statistics:');
        console.log(`   Users: ${stats.users}`);
        console.log(`   Jobs: ${stats.jobs}`);
        console.log(`   Applications: ${stats.applications}`);
        break;

      case 'reset':
        console.log('🔄 Resetting database (clear + seed)...');
        await clearDatabase();
        const resetResult = await seedDatabase();
        console.log('\n📊 Reset Results:');
        console.log(`   Users: ${resetResult.users}`);
        console.log(`   Jobs: ${resetResult.jobs}`);
        console.log(`   Applications: ${resetResult.applications}`);
        break;

      default:
        console.log('❌ Invalid command. Available commands:');
        console.log('   seed   - Seed the database with mock data');
        console.log('   clear  - Clear all data from the database');
        console.log('   stats  - Show database statistics');
        console.log('   reset  - Clear and seed the database');
        console.log('\nUsage: node src/scripts/seed.js <command>');
        process.exit(1);
    }

    console.log('\n✅ Operation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
main().finally(async () => {
  // Rebuild indexes after operations if they were disabled
  if (process.env.DISABLE_INDEXES === 'true') {
    console.log('\n🔧 Rebuilding indexes...');
    try {
      await Promise.all([
        (await import('../models/User.js')).then(m => m.default.syncIndexes?.()),
        (await import('../models/Job.js')).then(m => m.default.syncIndexes?.()),
        (await import('../models/Application.js')).then(m => m.default.syncIndexes?.())
      ]);
      console.log('✅ Indexes rebuilt successfully');
    } catch (e) {
      console.error('⚠️  Failed to rebuild indexes:', e?.message || e);
    }
  }
});
