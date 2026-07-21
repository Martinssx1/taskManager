const pool = require("../db");

async function getName(req, res) {
  const [rows] = await pool.query(
    "SELECT fullname FROM taskappusers WHERE id = ?",
    [req.user.userId],
  );

  res.json(rows[0]);
}
module.exports = getName;
