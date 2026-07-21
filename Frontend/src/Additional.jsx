import {
  AlertTriangle,
  ClipboardList,
  Trash2,
  X,
  Pencil,
  Clock,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import { useTaskContext } from "./useContext";

const PRIORITY_STYLES = {
  high: {
    label: "High",
    dot: "bg-rose-500",
    text: "text-rose-700",
    ring: "ring-rose-200",
    bg: "bg-rose-50",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-500",
    text: "text-amber-700",
    ring: "ring-amber-200",
    bg: "bg-amber-50",
  },
  low: {
    label: "Low",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
  },
};

const STATUS_META = {
  todo: { label: "To do", icon: Circle, text: "text-stone-500" },
  "in-progress": { label: "In progress", icon: Clock, text: "text-amber-600" },
  done: { label: "Done", icon: CheckCircle2, text: "text-teal-600" },
};

function formatDate(iso) {
  if (!iso) return "No due date";

  const d = new Date(iso);

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
      <AlertTriangle size={12} /> {children}
    </p>
  );
}

export function TextField({ label, icon: Icon, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </span>
      <span className="relative flex items-center">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 text-stone-400"
          />
        )}
        <input
          {...props}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-stone-900 outline-none transition focus:ring-2 ${
            error
              ? "border-rose-300 focus:ring-rose-200"
              : "border-stone-300 focus:border-teal-600 focus:ring-teal-100"
          } ${Icon ? "pl-9 pr-3" : "px-3"}`}
        />
      </span>
      <FieldError>{error}</FieldError>
    </label>
  );
}

export function Logo({ size = "text-2xl" }) {
  return (
    <div
      className={`flex items-center gap-2 font-serif ${size} text-stone-900`}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-teal-800 text-amber-300">
        <ClipboardList size={18} strokeWidth={2.2} />
      </span>
      <span className="tracking-tight">Ledger</span>
    </div>
  );
}
export function OnLogOut(onCancel, onConfirm) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-1 font-serif text-lg text-stone-900">
          Sure you want to logout?
        </h2>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
export function DeleteConfirmModal({ task, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <Trash2 size={18} />
        </div>
        <h2 className="mb-1 font-serif text-lg text-stone-900">
          Delete this task?
        </h2>
        <p className="mb-5 text-sm text-stone-500">
          "{task.title}" will be removed for good. This can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete task
          </button>
        </div>
      </div>
    </div>
  );
}
export function TaskFormModal({ initialTask, onCancel, onSave }) {
  const isEdit = Boolean(initialTask);
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || "",
  );
  const [priority, setPriority] = useState(initialTask?.priority || "medium");
  const [status, setStatus] = useState(initialTask?.status || "todo");
  const [due, setDue] = useState(initialTask?.due || "");
  const [error, setError] = useState("");
  //took to context................
  const { saveTask } = useTaskContext();
  //swapped for context
  /*
  async function saveTask() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
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
    */
  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }
    if (!due) {
      setError("Please select a due date.");
      return;
    }
    // TASK ACTIONS: replace with a real create/update request
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority: priority,
      status: status,
      due_date: due,
    });
    saveTask(isEdit, title, description, priority, status, due);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-lg text-stone-900">
            {isEdit ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <TextField
            label="Title"
            placeholder="e.g. Write release notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={error && !title ? "Give the task a title" : ""}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-stone-700">
              Description
            </span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
              className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-stone-700">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-stone-700">
                Status
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              >
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
          </div>

          <TextField
            label="Due date"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            error={error && !due ? "Please select a due date." : ""}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white hover:bg-teal-900"
            >
              {isEdit ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const p = PRIORITY_STYLES[task.priority];
  const s = STATUS_META[task.status];
  const StatusIcon = s.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <span className={`absolute left-0 top-0 h-full w-1 ${p.dot}`} />
      <div className="flex items-start justify-between gap-3 pl-2">
        <button
          onClick={() => onToggleStatus(task)}
          className={`mt-0.5 shrink-0 transition ${s.text} hover:scale-110`}
          title="Cycle status"
        >
          <StatusIcon size={19} />
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`truncate font-medium text-stone-900 ${task.status === "done" ? "line-through text-stone-400" : ""}`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">
              {task.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ${p.bg} ${p.text} ${p.ring}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} /> {p.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
              {s.label}
            </span>
            <span className="text-stone-400">
              Due {formatDate(task.due_date)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-teal-700"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="rounded-md p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
