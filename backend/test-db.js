import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    const uri = "mongodb://MunafSharif:Munaf123@ac-nzgbvf3-shard-00-00.bkykw01.mongodb.net:27017,ac-nzgbvf3-shard-00-01.bkykw01.mongodb.net:27017,ac-nzgbvf3-shard-00-02.bkykw01.mongodb.net:27017/healthgenie?ssl=true&authSource=admin&retryWrites=true&w=majority";
    console.log('Testing old connection string without replicaSet param...');
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ SUCCESS! Connected to MongoDB Atlas: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ FAILED to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

testConnection();
