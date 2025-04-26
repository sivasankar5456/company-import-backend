import mongoose from "mongoose";

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB Connect Successfully!!!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default db_connection;
