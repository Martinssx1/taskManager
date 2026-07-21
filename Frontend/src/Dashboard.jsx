import { useState, useMemo, useEffect } from "react";
import { LogOut, Plus, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Logo,
  DeleteConfirmModal,
  TaskFormModal,
  TaskCard,
  OnLogOut,
} from "./Additional.jsx";
import { useTaskContext } from "./useContext.js";
export default function Dashboard({ onSave, onDelete, onToggleStatus }) {
  const navigate = useNavigate();
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();

  const token = localStorage.getItem("token");
  const { saveTask, deleteTask } = useTaskContext();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      // throw new Error("No token found in localStorage");
      return;
    }
    async function getUser() {
      try {
        const res = await fetch("http://localhost:3000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("error getting fullname");
        }
        const data = await res.json();
        setName(data.fullname);
      } catch (error) {
        console.error(error);
        return;
      }
    }
    getUser();

    async function fetchTasks() {
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("gettaskdata", data);
        setUpdatedTasks(data.tasks);
        console.log("updatedtasks useeffect:", data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [navigate, token]);

  /* function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }*/

  const [modal, setModal] = useState(null); // { type: 'create' | 'edit' | 'delete', task? }
  const [filter, setFilter] = useState("all");

  const counts = useMemo(
    () => ({
      all: updatedTasks?.length ?? 0,
      todo: updatedTasks?.filter((t) => t.status === "todo").length ?? 0,
      "in-progress":
        updatedTasks?.filter((t) => t.status === "in-progress").length ?? 0,
      done: updatedTasks?.filter((t) => t.status === "done").length ?? 0,
    }),
    [updatedTasks],
  );

  const visibleTasks =
    filter === "all"
      ? updatedTasks
      : updatedTasks?.filter((t) => t.status === filter);

  return (
    <>
      {loading ? (
        <div>
          <div className="flex min-h-screen items-center justify-center bg-stone-100">
            <div className="animate-spin rounded-full border-4 p-2 border-t-teal-800 border-r-teal-800 border-b-teal-800 border-l-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-stone-100">
          <header className="border-b border-stone-200 bg-white">
            <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
              <Logo size="text-xl" />
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-stone-500 sm:inline">
                  Hi, {name.split(" ")[0]}
                </span>
                <button
                  onClick={OnLogOut}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl px-5 py-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1 className="font-serif text-2xl text-stone-900">
                  Your tasks
                </h1>
                <p className="text-sm text-stone-500">
                  {counts.done} of {counts.all} done · {counts["in-progress"]}{" "}
                  in progress
                </p>
              </div>
              <button
                onClick={() => setModal({ type: "create" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
              >
                <Plus size={16} /> New task
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["todo", "To do"],
                ["in-progress", "In progress"],
                ["done", "Done"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filter === key
                      ? "bg-teal-800 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {label} <span className="opacity-70">({counts[key]})</span>
                </button>
              ))}
            </div>
            {/*
            {updatedTasks?.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white py-14 text-center">
                <ClipboardList
                  className="mx-auto mb-3 text-stone-300"
                  size={32}
                />
                <p className="text-sm text-stone-500">
                  Nothing here yet. Add a task to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {updatedTasks?.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => setModal({ type: "edit", task: t })}
                    onDelete={(t) => setModal({ type: "delete", task: t })}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </div>
            )}
            */}

            {visibleTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white py-14 text-center">
                <ClipboardList
                  className="mx-auto mb-3 text-stone-300"
                  size={32}
                />
                <p className="text-sm text-stone-500">
                  Nothing here yet. Add a task to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {
                  //this is where u stopped!
                }
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => setModal({ type: "edit", task: t })}
                    onDelete={(t) => setModal({ type: "delete", task: t })}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </div>
            )}
          </main>

          {(modal?.type === "create" || modal?.type === "edit") && (
            <TaskFormModal
              initialTask={modal.type === "edit" ? modal.task : null}
              onCancel={() => setModal(null)}
              onSave={async (task) => {
                onSave(task, modal.type);
                const createOrEditTask = await saveTask(
                  modal?.type === "edit",
                  task?.title,
                  task?.description,
                  task?.priority,
                  task?.status,
                  task?.due_date,
                );
                //needd to return backend for id  setUpdateTasks((prev) => [task, ...prev]);
                setUpdatedTasks((prev) => [createOrEditTask, ...prev]);
                console.log("updatedtasks after save:", updatedTasks);
                setModal(null);
              }}
            />
          )}

          {modal?.type === "delete" && (
            <DeleteConfirmModal
              task={modal.task}
              onCancel={() => setModal(null)}
              onConfirm={() => {
                onDelete(modal.task);
                deleteTask(modal.task.id, setUpdatedTasks);
                //console.log("id", modal.task.id);
                setModal(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
