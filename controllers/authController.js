const User = require("../models/User");
const HealthCareProvider = require("../models/HealthCareProvider");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      salt
    );
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
    const duplicate = await HealthCareProvider.findOne({
      email: req.body.accountInformation.email,
    })
      .lean()
      .exec();
    if (duplicate) {
      return res.status(409).json({ message: "User already exists !" });
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const newHCP = new HealthCareProvider(req.body);
    await newHCP.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Erorr Occured during Signup" });
  }
}

async function userLogin(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValid) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );

    res.cookie("jwttoken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 10,
    });
    console.log(`${user.name} logged in at ${new Date().toISOString()}`);
    res.status(200).json({ accessToken, message: "Logged In Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An Error Occurred during Login" });
  }
}

async function Refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwttoken)
    return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwttoken;

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
          expiresIn: "5m",
        }
      );
      res.json({ accessToken });
    }
  );
}

async function Logout(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwttoken) return res.sendStatus(204);
  res.clearCookie("jwttoken", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });
  res.json({ message: "Logged Out Successfully" });
}

module.exports = { userSignup, hcpSignup, userLogin, Refresh, Logout };
