import express from "express";
import { connectDB } from "./src/config/dataBase.js";
import dotenv from 'dotenv';
import { authRouter, productRouter } from "./src/routers/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3045;
app.use(express.json());
//connect to DB
connectDB()

//auth router
app.use("/auth", authRouter);
app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is running",
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});