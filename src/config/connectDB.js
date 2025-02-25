import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      dbName: "studentManager",
    });
    console.log("Server connected with MongoDB Atlas DBMS");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
