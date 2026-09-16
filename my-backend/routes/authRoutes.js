const express = require("express");
const router = express.Router();
const {
  postLogin,
  postSignUp,
  getSignUp,
  sendEmailVerification,
} = require("../controllers/authControllers");

router.get("/signup", getSignUp);
router.post("/signup", postSignUp);
router.post("/login", postLogin);
router.put("/send-verification-email", async (req, res) => {
  try {
    const { email } = req.body;
    await sendEmailVerification(email);
    return res.status(200).json({
      code: "EMAIL_VERIFICATION_SENT",
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.log("Error in /send-verification-email route:", error);
    return res.status(500).json({
      code: "EMAIL_VERIFICATION_FAILED",
      message: "couldnt send verification email,try again.",
    });
  }
});
module.exports = router;
