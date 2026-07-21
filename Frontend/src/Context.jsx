import { useState } from "react";
import { context } from "./useContext";
export default function ContextRoot({ children }) {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  async function saveTask(isEdit, title, description, priority, status, due) {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          priority: priority,
          status: status,
          due_date: due,
        }),
      });
      const data = await response.json();

      console.log("task-data from main returned:", data.task);
      return data.task;
    } catch (error) {
      console.error("Error saving task:", error);
      return;
    }
  }
  async function deleteTask(id, setUpdatedTasks) {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw Error("something went wrong when trying to delete");
      }
      setUpdatedTasks((prev) => prev.filter((task) => task.id !== id));
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <context.Provider value={{ saveTask, deleteTask, setUser, user }}>
      {children}
    </context.Provider>
  );
}
