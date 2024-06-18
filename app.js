require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const session = require("express-session")
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
// const verifyJWT = require('./middleware/verifyJWT')
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointment")
const hcpRoutes = require("./routes/hcp")
const userRoutes = require("./routes/user")
const medicalRecordRoutes = require("./routes/medicalrecords");
const emailRoutes = require("./routes/email");

const port = process.env.PORT || 4500;

connectDB();
app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 app.use(
   session({
     secret: process.env.ACCESS_TOKEN_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: true,
       httpOnly: true,
       sameSite: 'strict',
     },
   })
 );
app.use("/auth", authRoutes);
app.use("/appointment", appointmentRoutes)
app.use("/hcps" , hcpRoutes)
app.use("/users",userRoutes)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(`
    <h1>One Health Backend</h1>
    `);
});

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
