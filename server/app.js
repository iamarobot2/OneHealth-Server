require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { logger } = require("./middleware/logger");
const connectDB = require("./config/dbCon");
const PORT = process.env.PORT || 4500;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(logger);
connectDB();

app.get("/", (req, res) => {
  res.sendStatus(200);
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
