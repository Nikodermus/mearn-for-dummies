import mongoose from "mongoose";
import config from "config";
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true });
    console.log("Connected bip bip");
  } catch ({ message }) {
    console.error(message);
    process.exit(1);
  }
};

export default connectDB;
