import { useState } from "react";
import { context } from "./useContext";
export default function ContextRoot({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [authError, setAuthError] = useState("");

  const [verificationEmailSucess, setVerificationEmailSuccess] =
    useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  async function resendVerificationEmail(email) {
    setIsVerifyLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-verification-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || "Failed to resend verification email.");
        throw new Error(data.message || "Failed to resend verification email.");
      }
      setIsVerifyLoading(false);
      setVerificationEmailSuccess(true);
     
    } catch (error) {
      console.error("Error resending verification email:", error);
    }
  }

  function formatDate(iso) {
    if (!iso) return "No due date";

    const d = new Date(iso);

    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function saveTask(
    title,
    description,
    priority,
    status,
    due,
    created_at,
    completed_at,
  ) {
   
    if (!token) return;
  

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
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
          created_at: created_at,
          completed_at: completed_at,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error saving taskressssssss:", data);
        throw new Error(data.message || "Failed to save task.");
      }

   
      return data.task;
    } catch (error) {
      console.error("Error saving task:", error);
      return;
    }
  }
  //maybeeeeeee edited  taskkkkkkkkkkkkk
  async function editTask(
    id,
    title,
    description,
    priority,
    status,
    due,
    completed_at,
  ) {
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        {
          method: "PUT",
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
            completed_at: completed_at,
          }),
        },
      );
      if (!response.ok) {
        throw Error("something went wrong when trying to edit");
      }
      const data = await response.json();

      
      return data;
    } catch (error) {
      console.error("Error editing task:", error);
      return;
    }
  }

  function onLogOutCancel() {
    setShowLogoutModal((prev) => !prev);
  }

  async function deleteTask(id, setUpdatedTasks) {
    if (!token) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
    <context.Provider
      value={{
        saveTask,
        editTask,
        deleteTask,
        setUser,
        user,
        onLogOutCancel,
        showLogoutModal,
        setShowLogoutModal,
        formatDate,
        resendVerificationEmail,
        setAuthError,
        authError,
        verificationEmailSucess,
        isVerifyLoading,
        setToken,
      }}
    >
      {children}
    </context.Provider>
  );
}
