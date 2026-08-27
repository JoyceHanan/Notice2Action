import React from "react";

const TaskItem = ({ task, onToggle }) => {
  const completed = task.status === "completed";

  const priorityStyles = {
    urgent: "bg-red-50 text-red-700",
    high: "bg-orange-50 text-orange-700",
    medium: "bg-blue-50 text-blue-700",
    low: "bg-slate-100 text-slate-600",
  };

  const priority =
    task?.priority?.toLowerCase() || "low";

  return (
    <div
      className={`flex items-center gap-4 border-b border-slate-100 py-4 last:border-b-0 ${
        completed ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(task._id)}
        aria-label={
          completed
            ? "Mark task as incomplete"
            : "Mark task as complete"
        }
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm font-bold transition ${
          completed
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-slate-300 bg-white text-transparent hover:border-indigo-500"
        }`}
      >
        ✓
      </button>

      {/* Task */}
      <div className="min-w-0 flex-1">
        <h4
          className={`font-medium ${
            completed
              ? "text-slate-400 line-through"
              : "text-slate-800"
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="mt-1 text-xs text-slate-500">
            {task.description}
          </p>
        )}

        {task.deadline && (
          <p className="mt-1 text-xs text-slate-400">
            Due:{" "}
            {new Date(
              task.deadline
            ).toLocaleDateString("en-IN")}
          </p>
        )}
      </div>

      {/* Priority */}
      <span
        className={`hidden rounded-full px-3 py-1 text-xs font-semibold capitalize sm:block ${
          priorityStyles[priority] ||
          priorityStyles.low
        }`}
      >
        {priority}
      </span>
    </div>
  );
};

export default TaskItem;