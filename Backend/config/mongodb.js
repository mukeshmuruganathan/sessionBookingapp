import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    try {
        if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
            await mongoose.connect(uri);
            console.log('MongoDB Connected');
        } else {
            console.log('No URI found, launching in-memory DB...');
            const mongod = await MongoMemoryServer.create();
            await mongoose.connect(mongod.getUri());
            console.log('In-Memory DB Active');
        }
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

export default connectDB;