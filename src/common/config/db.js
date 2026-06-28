import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    const connection = await mongoose.connect(dbURI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;
