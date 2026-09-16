const pool = require("../db");

async function postAllUserTask(req, res) {
  console.log("post running");
  try {
    const { title, description, priority, status, due_date, created_at } =
      req.body;
    const [result] = await pool.query(
      `INSERT INTO tasktable (title,description,priority,status,due_date,user_id,created_at) VALUES(?,?,?,?,?,?,?)`,
      [
        title,
        description,
        priority,
        status,
        due_date,
        req.user.userId,
        created_at,
      ],
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
        created_at: created_at,
      },
    });
  } catch (error) {
    return res.json({
      message: "unable to add tasks",
      error: error.message,
    });
  }
}

async function getAllUserTask(req, res) {
  try {
    const [tasks] = await pool.query(
      "SELECT  id, user_id, title, description, priority, status, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date,DATE_FORMAT(created_at, '%Y-%m-%d') as created_at,completed_at FROM tasktable WHERE user_id = ? ORDER BY id DESC",
      [req.user.userId],
    );
    return res.json({
      message: "welcome !",
      user: req.user,
      tasks: tasks,
    });
  } catch (error) {
    return res.json({
      error: error.message,
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
    res.json({
      error: error.message,
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
      error: error.message,
    });
  }
}

async function editTaskByTaskId(req, res) {
  const { title, status, description, priority, due_date, completed_at } =
    req.body;
  try {
    const [result] = await pool.query(
      "UPDATE tasktable SET title = ? ,description = ?,priority = ?,status = ?,due_date = ?,completed_at = ? WHERE id = ? AND user_id = ?",
      [
        title,
        description,
        priority,
        status,
        due_date,
        completed_at,
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
    return res.json({
      error: error.message,
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
