require("dotenv").config();
const jwttoken = require("jsonwebtoken");
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "no token found ",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwttoken.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
module.exports = auth;
