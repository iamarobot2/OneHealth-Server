const User = require("../models/User");
const Hcp = require("../models/HealthCareProvider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");

async function userSignup(req, res) {
  try {
    const duplicate = await User.findOne({
      email: req.body.email,
    })
      .lean()
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "User already exists !" });
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Erorr Occured during Signup" });
  }
}

async function hcpSignup(req, res) {
  try {
    const duplicate = await Hcp.findOne({
      email: req.body.email,
    })
      .lean()
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "User already exists !" });
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newHCP = new Hcp(req.body);
    await newHCP.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Erorr Occured during Signup" });
  }
}

async function Login(req, res) {
  try {
    const { email, password, role } = req.body;
    const Model = role === "healthcareprovider" ? Hcp : User;
    const user = await Model.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otp = otp;
    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + 10 * 60000); // Ensure 10 minutes

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "One Health Login OTP",
      text: `Your OTP code for login is ${otp}. It is only valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent to email",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An Error Occurred during Login" });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp, role } = req.body;
    const Model = role === "healthcareprovider" ? Hcp : User;
    const user = await Model.findOne({ email }).select("-password otp otpHash otpExpires").exec();
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (new Date() > user.otpExpires) {
      // Correctly check expiration
      return res.status(400).json({ message: "OTP expired" });
    }
    const isOtpValid = await bcrypt.compare(otp, user.otpHash);
    if (!isOtpValid) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "60m",
      }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/refresh",
    });
    console.log(`${user.fullname} logged in at ${new Date().toISOString()}`);
    res.status(200).json({
      message: "Logged In Successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        dob: user.dob,
        gender:user.gender,
        bloodgroup : user.bloodgroup,
        contactnumber : user.contactnumber,
        address : user.address
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An Error Occurred during Login" });
  }
}

async function Refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const user = await User.findOne({ _id: decoded.userId });
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      const accessToken = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    }
  );
}

async function Logout(req, res) {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/refresh" });
  return res.json({ message: "Logged Out Successfully" });
}

module.exports = {
  userSignup,
  hcpSignup,
  Login,
  verifyOTP,
  Refresh,
  Logout,
};
