const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    console.log("User request invalid")
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      {
        console.log("User request Forbidden")
        return res.status(403).json({ message: "Forbidden" });
      }
    req.user = decoded.userId;
    req.role = decoded.role;
    next();
  });
}

module.exports = verifyJWT
