import React, { useState } from "react";

const Reminders = () => {
  const [reminders, setReminders] = useState([
    {
      _id: "1",
      title: "Placement Registration",
      description:
        "Complete your registration before the deadline.",
      date: "2026-08-30",
      type: "deadline",
      completed: false,
    },
    {
      _id: "2",
      title: "Upload Marksheet",
      description:
        "Upload your latest marksheet.",
      date: "2026-08-29",
      type: "task",
      completed: false,
    },
  ]);

  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder._id === id
          ? {
              ...reminder,
              completed: !reminder.completed,
            }
          : reminder
      )
    );
  };

  return (
    <div className="reminders-page">

      <div className="page-header">
        <h1>Reminders 🔔</h1>

        <p>
          Stay on top of your deadlines and pending actions.
        </p>
      </div>

      <div className="reminder-list">

        {reminders.length === 0 ? (
          <div className="empty-state">
            <span>🎉</span>
            <h3>No reminders</h3>
            <p>You are all caught up!</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`reminder-card ${
                reminder.completed ? "completed" : ""
              }`}
            >
              <div className="reminder-icon">
                {reminder.type === "deadline"
                  ? "⏰"
                  : "✅"}
              </div>

              <div className="reminder-content">
                <h3>{reminder.title}</h3>

                <p>{reminder.description}</p>

                <span>
                  Due:{" "}
                  {new Date(
                    reminder.date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <button
                className="reminder-button"
                onClick={() =>
                  toggleReminder(reminder._id)
                }
              >
                {reminder.completed
                  ? "Completed"
                  : "Mark Done"}
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Reminders;