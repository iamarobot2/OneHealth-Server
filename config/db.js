const mongoose = require("mongoose");
mongoose.set("strictQuery", true, "useNewUrlParser", true);
DB_URL = process.env.MONGODB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB is Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;