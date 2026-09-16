const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  postAllUserTask,
  getAllUserTask,
  getTaskByTaskId,
  deleteTaskByTaskId,
  editTaskByTaskId,
} = require("../controllers/taskControllers");

router.post("/", auth, postAllUserTask);
router.get("/", auth, getAllUserTask);
router.get("/:id", auth, getTaskByTaskId);
router.delete("/:id", auth, deleteTaskByTaskId);
router.put("/:id", auth, editTaskByTaskId);

module.exports = router;
