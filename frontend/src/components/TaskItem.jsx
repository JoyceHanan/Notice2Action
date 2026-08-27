import React from "react";

const TaskItem = ({ task, onToggle }) => {
  return (
    <div className={`task-item ${task.status === "completed" ? "completed" : ""}`}>
      <button
        className="task-checkbox"
        onClick={() => onToggle(task._id)}
      >
        {task.status === "completed" ? "✓" : ""}
      </button>

      <div className="task-content">
        <h4>{task.title}</h4>

        {task.description && (
          <p>{task.description}</p>
        )}

        {task.deadline && (
          <small>
            Due:{" "}
            {new Date(task.deadline).toLocaleDateString("en-IN")}
          </small>
        )}
      </div>

      {task.priority && (
        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>
      )}
    </div>
  );
};

export default TaskItem;