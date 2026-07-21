import Dashboard from "./Dashboard";
import Login from "./Login";
import RegisterPage from "./Register";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
function App() {
  // const [setPage] = useState("login"); // 'login' | 'register' | 'dashboard'

  const [currentUser] = useState({ name: "tega Lovelace" });

  const seedTasks = [
    /* {
      id: "t1",
      title: "Draft Q3 planning doc",
      description: "Outline goals, staffing, and budget for next quarter.",
      priority: "high",
      status: "in-progress",
      due: "2026-07-10",
    },
    {
      id: "t2",
      title: "Review pull requests",
      description: "Check open PRs on the api-gateway repo.",
      priority: "medium",
      status: "todo",
      due: "2026-07-06",
    },
    {
      id: "t3",
      title: "Renew domain registration",
      description: "taskflow.app expires end of month.",
      priority: "low",
      status: "done",
      due: "2026-06-28",
    },*/
  ];
  const [tasks, setTasks] = useState(seedTasks);

  const STATUS_CYCLE = ["todo", "in-progress", "done"];

  //function handleSaveTasks(tasks) {
  //  setTasks(tasks);
  //}

  async function handleSaveTask(task, mode, functionToCall) {
    // TASK ACTIONS: POST /api/tasks  or  PUT /api/tasks/:id
    /*setTasks((prev) =>
      mode === "edit"
        ? prev.map((t) => (t.id === task.id ? task : t))
        : [task, ...prev],
    );
    
    
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found ");
    }
    try {
      if (mode !== "edit") {
        const res = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        });
        if (!res.ok) {
          throw new Error("Failed to save task");
        }
        const data = await res.json();
        console.log("task-data:", data);
      } else {
        return;
      }
    } catch (error) {
      console.error("Error saving task:", error);
      return;
    }*/
    if (mode !== "edit") {
      //  here here ! setUpdateTasks((prev) => [task, ...prev]);
    }
    if (functionToCall) return;
  }

  /*function handleDeleteTask(task) {
    // TASK ACTIONS: DELETE /api/tasks/:id
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }*/
  //do this next
  function handleToggleStatus(task) {
    const idx = STATUS_CYCLE.indexOf(task.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)),
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <Dashboard
            user={currentUser}
            tasks={tasks}
            onSave={handleSaveTask}
            onToggleStatus={handleToggleStatus}
          />
        }
      />
    </Routes>
  );
}

export default App;
