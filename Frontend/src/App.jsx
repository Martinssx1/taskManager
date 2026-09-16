import Dashboard from "./Dashboard";
import Login from "./Auth/Login";
import RegisterPage from "./Auth/Register.jsx";
import EmailVerificationPage from "./Auth/EmailVerificationPage";
import SignupSuccess from "./Auth/Signupsuccess";
import { Routes, Route } from "react-router-dom";
import { useTaskContext } from "./context/useContext.js";
import { useRef } from "react";

function App() {
  const { editTask } = useTaskContext();
  const STATUS_CYCLE = ["todo", "in-progress", "done"];
  const timerRef = useRef(new Map());

  function handleToggleStatus(task, setTasks) {
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    const completedAt = new Date().toISOString();

    const mysqlDateTime = completedAt.replace("T", " ").split(".")[0];

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: next,
              completed_at: next === "done" ? mysqlDateTime : null,
            }
          : t,
      ),
    );

    const previousTimer = timerRef.current.get(task?.id);
    if (previousTimer) {
      clearTimeout(previousTimer);
    }

    const timeOut = setTimeout(async () => {
      try {
        await editTask(
          task?.id,
          task?.title,
          task?.description,
          task?.priority,
          next,
          task?.due_date,
          next === "done" ? mysqlDateTime : null,
        );

        timerRef.current.delete(task.id);
      } catch (error) {
        console.error("Error editing task:", error);
        return;
      }
    }, 5000);
    timerRef.current.set(task.id, timeOut);
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={<Dashboard onToggleStatus={handleToggleStatus} />}
      />
      <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
    </Routes>
  );
}

export default App;
