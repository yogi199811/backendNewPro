import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected host : ${conn.connection.host}`);

    mongoose.connection.on("connected", () => {
      console.log("Mongo DB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongo DB error", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.error("Mongo DB is disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDb;
