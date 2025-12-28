import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the unique index on vectorStoreId
    const db = mongoose.connection.db;
    const collection = db.collection('documents');
    
    try {
      await collection.dropIndex('vectorStoreId_1');
      console.log('✅ Dropped unique index on vectorStoreId');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index does not exist, skipping...');
      } else {
        console.log('Index drop error:', error.message);
      }
    }

    // Optionally, clear all documents if needed (uncomment if you want to start fresh)
    // await collection.deleteMany({});
    // console.log('✅ Cleared all documents');

    console.log('✅ Database fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();
