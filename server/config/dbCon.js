const mongoose = require("mongoose");
mongoose.set("strictQuery", true, "useNewUrlParser", true);

DB_URL = process.env.DB_URL;
const ConnectDB = async () => {
  try {
    await mongoose.connect(DB_URL, () => {
      console.log("Databse Connected Successfully.");
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = ConnectDB;
