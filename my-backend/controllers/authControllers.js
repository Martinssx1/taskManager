require("dotenv").config();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");
async function getSignUp(req, res) {
  try {
    const [logincreditials] = await pool.query("SELECT * FROM taskappusers");
    return res.json({
      message: "signUp successfull",
    });
  } catch (error) {
    console.error("error", error);
    return;
  }
}
//man

async function postSignUp(req, res) {
  const { fullName, email, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password field is required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO taskappusers (fullName, email, password) VALUES(?,?,?) `,
      [fullName, email, hashedPassword],
    );
    return res.status(201).json({
      message: "User created successfully",
      result: result,
    });
  } catch (error) {
    console.error("unable to hash password", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const [user] = await pool.query(
      `SELECT * FROM taskappusers WHERE email = ? `,
      [email],
    );
    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    //jwt sign
    const token = jwttoken.sign(
      {
        userId: user[0].id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );
    return res.json({
      message: "login  successfully",
      token: token,
    });
  } catch (error) {
    return res.json({
      message: "post login error",
      error: error,
    });
  }
}
module.exports = {
  postLogin,
  postSignUp,
  getSignUp,
};
