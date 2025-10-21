import mongoose from "mongoose";

export async function connectMongo() {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err)
    console.error("MongoDB connection failed");
    process.exit(1);
  }
}
