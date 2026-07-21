const express = require("express");
const router = express.Router();
const getName = require("../controllers/meControllers");
const auth = require("../middleware/auth");

router.get("/", auth, getName);

module.exports = router;
