import { useState, useMemo, useEffect } from "react";
import { LogOut, Plus, ClipboardList, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Themebutton } from "./Theme/Themebutton";
import {
  Logo,
  DeleteConfirmModal,
  TaskFormModal,
  TaskCard,
  OnLogOut,
} from "./Additional.jsx";
import { useTaskContext } from "./context/useContext.js";
export default function Dashboard({ onToggleStatus }) {
  const navigate = useNavigate();
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState();
  const [modal, setModal] = useState(null); // { type: 'create' | 'edit' | 'delete', task? }
  const [filter, setFilter] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const { saveTask, deleteTask, editTask, onLogOutCancel } = useTaskContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");

      return;
    }
    async function getUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
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

        setUpdatedTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [navigate, token]);

  const counts = useMemo(() => {
    return {
      all: updatedTasks?.length ?? 0,
      todo: updatedTasks?.filter((t) => t.status === "todo").length,
      "in-progress": updatedTasks?.filter((t) => t.status === "in-progress")
        .length,
      done: updatedTasks?.filter((t) => t.status === "done").length,
    };
  }, [updatedTasks]);

  const visibleTasks = updatedTasks
    ?.filter((t) => filter === "all" || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {loading ? (
        <div>
          <div className="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-950">
            <div className="animate-spin rounded-full border-4 p-2 border-t-teal-800 border-r-teal-800 border-b-teal-800 border-l-transparent dark:border-t-teal-400 dark:border-r-teal-400 dark:border-b-teal-400"></div>
          </div>
        </div>
      ) : (
        <div className=" bg-stone-100 dark:bg-stone-950">
          <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300  ${
              isScrolled
                ? "bg-white dark:bg-stone-900  "
                : " bg-white  dark:bg-stone-900 shadow-lg"
            }`}
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
              <Logo size="text-xl" />
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-stone-500 sm:inline dark:text-stone-400">
                  Hi, {name?.split(" ")[0]}
                </span>
                <Themebutton />
                {/* hereeeeeeeeeeeeeeeeeeee */}
                <button
                  onClick={onLogOutCancel}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            </div>
            <OnLogOut />
          </nav>

          <main className=" min-h-screen mt-15 mx-auto max-w-3xl px-5 py-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h1 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                  Your tasks
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {counts.done} of {counts.all} done · {counts["in-progress"]}{" "}
                  in progress
                </p>
              </div>
              <button
                onClick={() => setModal({ type: "create" })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                <Plus size={16} /> New task
              </button>
            </div>
            <div className="relative mb-4 w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-none dark:border-stone-700 bg-white dark:bg-stone-900 py-2.5 pl-10 pr-4 text-sm text-black dark:text-stone-100 outline-none placeholder:text-stone-500 focus:border-teal-500"
              />
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
                      ? "bg-teal-800 text-white dark:bg-teal-700"
                      : "bg-white text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                  }`}
                >
                  {label} <span className="opacity-70">({counts[key]})</span>
                </button>
              ))}
            </div>

            {visibleTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-white py-14 text-center dark:border-stone-700 dark:bg-stone-900">
                <ClipboardList
                  className="mx-auto mb-3 text-stone-300 dark:text-stone-600"
                  size={32}
                />
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Nothing here yet. Add a task to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {
                  //task visible ttaskkkkk
                }
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => setModal({ type: "edit", task: t })}
                    onDelete={(t) => setModal({ type: "delete", task: t })}
                    onToggleStatus={() => onToggleStatus(task, setUpdatedTasks)}
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
                //problem maybe

                try {
                  const createTask = await saveTask(
                    task?.title,
                    task?.description,
                    task?.priority,
                    task?.status,
                    task?.due_date,
                    task.created_at,
                    task.completed_at,
                    token,
                  );

                  if (!createTask) {
                    console.error("saveTask returned undefined");
                    return;
                  }

                  setUpdatedTasks((prev) => [createTask, ...prev]);
                } catch (error) {
                  console.error("Error saving task:", error);
                  return;
                } finally {
                  setModal(null);
                }
              }}
              onEdit={async (task) => {
                const completedAt = new Date().toISOString();

                const mysqlDateTime = completedAt
                  .replace("T", " ")
                  .split(".")[0];
                try {
                  const editedTask = await editTask(
                    task?.id,
                    task?.title,
                    task?.description,
                    task?.priority,
                    task?.status,
                    task?.due_date,
                    mysqlDateTime,
                    token,
                  );
                  if (editedTask?.updated?.affectedRows === 1) {
                    setUpdatedTasks((prev) =>
                      prev.map((item) =>
                        item.id === task.id
                          ? {
                              ...item,
                              id: task?.id,
                              title: task?.title,
                              description: task?.description,
                              priority: task?.priority,
                              status: task?.status,
                              due_date: task?.due_date,
                              completed_at: task?.completed_at,
                            }
                          : item,
                      ),
                    );
                  }
                } catch (error) {
                  console.error("Error editing task:", error);
                  return;
                } finally {
                  setModal(null);
                }
              }}
            />
          )}

          {modal?.type === "delete" && (
            <DeleteConfirmModal
              task={modal.task}
              onCancel={() => setModal(null)}
              onConfirm={() => {
                deleteTask(modal.task.id, setUpdatedTasks, token);

                setModal(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
