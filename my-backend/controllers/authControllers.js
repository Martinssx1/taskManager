require("dotenv").config();

const pool = require("../db");
const bcrypt = require("bcrypt");
const jwttoken = require("jsonwebtoken");
const { sendEmailVerificationLink } = require("./emailVerificationController");
//might remove
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

async function sendEmailVerification(email) {
  try {
    const [existingUser] = await pool.query(
      `SELECT email_verified FROM taskappusers WHERE email = ?`,
      [email],
    );
    if (existingUser[0].email_verified) {
      return res.status(400).json({
        message: "Email is already verified. Please log in.",
      });
    }

    const [user] = await pool.query(
      `SELECT id FROM taskappusers WHERE email = ?`,
      [email],
    );

    const emailVerificationToken = jwttoken.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET_KEY_EMAIL,
      { expiresIn: "5m" },
    );
    //hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    const verificationLink = ` ${process.env.VITE_FRONTEND_URL}/verify-email/${emailVerificationToken}`;
    await sendEmailVerificationLink(email, verificationLink);
  } catch (err) {
    console.error("Error sending email verification link: ", err);
    throw err;
  }
}

async function postSignUp(req, res) {
  const { fullName, email, password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password field is required." });
  }
  if (!email) {
    return res.status(400).json({ error: "Email field is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO taskappusers (fullName, email, password,verification_expires_at ) VALUES(?,?,?,DATE_ADD(NOW(), INTERVAL 24 HOUR)) `,
      [fullName, email, hashedPassword],
    );

    //email verification

    await sendEmailVerification(email);

    //ends here
    return res.status(201).json({
      message: "User created successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const [user] = await pool.query(
      `SELECT * FROM taskappusers WHERE email = ? `,
      [email],
    );
    if (!user || user.length === 0) {
      return res.status(403).json({
        code: "USER_NOT_FOUND",
        message: "User Not Found. Create an account ",
      });
    }
    const [existingUser] = await pool.query(
      `SELECT email_verified FROM taskappusers WHERE email = ?`,
      [email],
    );

    if (existingUser[0].email_verified === 0) {
      return res.status(403).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in.",
      });
    }
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
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Internal server error",
      message: "Unexpected error occurred during login",
    });
  }
}
module.exports = {
  postLogin,
  postSignUp,
  getSignUp,
  sendEmailVerification,
};
