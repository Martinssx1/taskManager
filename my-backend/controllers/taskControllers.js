const pool = require("../db");

async function postAllUserTask(req, res) {
  try {
    const { user_id, title, description, priority, status, due_date } =
      req.body;
    const [result] = await pool.query(
      `INSERT INTO tasktable (title,description,priority,status,due_date,user_id) VALUES(?,?,?,?,?,?)`,
      [title, description, priority, status, due_date, req.user.userId],
    );
    return res.json({
      message: "tasks added sucessfully",
      result: result,
      task: {
        id: result.insertId,
        title: title,
        description: description,
        priority: priority,
        status: status,
        due_date: due_date,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      message: "unable to add tasks",
    });
  }
}

async function getAllUserTask(req, res) {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasktable WHERE user_id = ? ORDER BY id DESC",
      [req.user.userId],
    );
    return res.json({
      message: "welcome !",
      user: req.user,
      tasks: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
}
async function getTaskByTaskId(req, res) {
  try {
    const [specificTask] = await pool.query(
      "SELECT * FROM tasktable WHERE id = ? AND user_id  = ?",
      [req.params.id, req.user.userId],
    );
    return res.json({
      message: "Got single task ",
      task: specificTask,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
    });
  }
}
async function deleteTaskByTaskId(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM tasktable WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.userId],
    );
    if (result.affectedRows === 0) {
      return res.json({
        message: "Task not found",
        result: result,
      });
    }
    return res.json({
      message: "task sucessfully deleted",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
}

async function editTaskByTaskId(req, res) {
  const { title, status, description, priority, due_date } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE tasktable SET title = ? , status = ?,priority = ?,due_date = ?,description = ? WHERE id = ? AND user_id = ?",
      [
        title,
        status,
        description,
        priority,
        due_date,
        req.params.id,
        req.user.userId,
      ],
    );
    if (result.affectedRows === 1) {
      return res.json({
        message: "successfully modified ",
        updated: result,
      });
    }
    return res.json({
      message: "task not found",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
}
module.exports = {
  postAllUserTask,
  getAllUserTask,
  getTaskByTaskId,
  deleteTaskByTaskId,
  editTaskByTaskId,
};
