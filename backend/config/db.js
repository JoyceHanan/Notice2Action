const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notice2action";
  try {
    const connection = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected successfully: ${connection.connection.host}`);
  } catch (error) {
    console.error("Primary MongoDB connection failed:", error.message);
    if (primaryUri.includes("mongodb+srv")) {
      console.log("Attempting local database fallback for local dev...");
      try {
        const localConnection = await mongoose.connect("mongodb://127.0.0.1:27017/notice2action");
        console.log(`MongoDB Local Fallback connected: ${localConnection.connection.host}`);
      } catch (localError) {
        console.error("Local database fallback failed:", localError.message);
      }
    }
  }
};

module.exports = connectDB;