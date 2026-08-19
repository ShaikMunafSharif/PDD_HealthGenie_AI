import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn('⚠️ No MONGO_URI provided in .env. Falling back to external APIs or mock data if implemented.');
      return false; // Not connected
    }
    
    // Attempt to connect with short timeout
    const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
    console.log(`✅ MongoDB Connected to Atlas: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('⚠️ Starting local in-memory MongoDB fallback...');
    
    try {
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (memError) {
       console.error(`❌ In-Memory DB failed: ${memError.message}`);
       return false;
    }
  }
};

export default connectDB;
