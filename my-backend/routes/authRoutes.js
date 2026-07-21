const express = require("express");
const router = express.Router();
const {
  postLogin,
  postSignUp,
  getSignUp,
} = require("../controllers/authControllers");
const auth = require("../middleware/auth");

router.get("/signup", getSignUp);
router.post("/signup", postSignUp);
router.post("/login", postLogin);
module.exports = router;
