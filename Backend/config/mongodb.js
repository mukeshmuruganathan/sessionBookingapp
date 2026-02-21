import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Establishment of the Database Connection
 * Supports both MongoDB Atlas (via MONGO_URI) and a local in-memory fallback for testing.
 */
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    try {
        // If an Atlas or local URI is provided, use it
        if (mongoUri && (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))) {
            await mongoose.connect(mongoUri);
            console.log('✅ MongoDB Connected matching URI');
        }
        // Fallback for development/testing environments without a configured DB
        else {
            console.warn('⚠️ No MONGO_URI found. Initializing a temporary in-memory database...');
            const mongoMemoryInstance = await MongoMemoryServer.create();
            await mongoose.connect(mongoMemoryInstance.getUri());
            console.log('🚀 In-Memory Database is now active');
        }
    } catch (error) {
        console.error('❌ CRITICAL: Database connection failed!');
        console.error(`Error Details: ${error.message}`);

        // Terminate process on connection failure to avoid undefined state
        process.exit(1);
    }
};

export default connectDB;
