import mongoose from "mongoose";

const MONGO_URL = "mongodb+srv://nguyencuong21520:I5BmpfUADxAhrmuk@web88.aqiqjh9.mongodb.net/web88"

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL);  
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  }catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}