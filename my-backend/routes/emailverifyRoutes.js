const express = require("express");
const router = express.Router();
const {
  emailPullVerify,
} = require("../controllers/emailVerificationController");

router.put("/:token", emailPullVerify);

module.exports = router;
