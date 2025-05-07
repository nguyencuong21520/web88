import mongoose from "mongoose";


export const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL;

  try {
    const conn = await mongoose.connect(MONGO_URL);  
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}