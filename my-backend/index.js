const express = require("express");

const pool = require("./db");
const cors = require("cors");
const app = express();

app.use(cors());

const auth = require("./middleware/auth");
const taskRoute = require("./routes/taskRoute");
const authRoute = require("./routes/authRoutes");
const meRoute = require("./routes/meRoutes");

const PORT = 3000;
// middleware (lets us read JSON)
app.use(express.json());

app.use("/tasks", taskRoute);
app.use("/auth", authRoute);
app.use("/me", meRoute);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
