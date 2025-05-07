import mongoose from "mongoose"

const mongoConnectString = "mongodb+srv://nguyencuong21520:I5BmpfUADxAhrmuk@web88.aqiqjh9.mongodb.net/web88"

export const connectDB = async ()=>{
    try {
        await mongoose.connect(mongoConnectString)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error connecting to MongoDB", error)
        process.exit(1)
    }
}
