const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/budgetwise";

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB connected → ${uri}`);
};
