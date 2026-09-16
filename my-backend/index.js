const express = require("express");

const pool = require("./db");
const cors = require("cors");
const app = express();

app.use(cors());

const taskRoute = require("./routes/taskRoute");
const authRoute = require("./routes/authRoutes");
const meRoute = require("./routes/meRoutes");
const emailRoutes = require("./routes/emailverifyRoutes");

// middleware (lets us read JSON)
app.use(express.json());

app.use("/tasks", taskRoute);
app.use("/auth", authRoute);
app.use("/me", meRoute);
app.use("/verify-email", emailRoutes);

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
