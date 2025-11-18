import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  console.log("IM HERE");
  console.log(process.env.MONGO_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("MongoDB connected:", conn.connection.host);
  } catch (err) {
    console.error("Mongo DB connection error:", err);
    throw err;
  }
}
