require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const port = process.env.PORT || 4500;
connectDB();
app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

const auth = require("./routes/auth");

app.get("/", (req, res) => {
  res.send(`
    <h1>One Health Backend</h1>
    `);
});
app.use("/auth", auth);
app.use(errorHandler);


mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on("error", err => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
