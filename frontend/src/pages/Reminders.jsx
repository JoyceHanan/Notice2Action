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
      date: "2026-08-31",
      type: "task",
      completed: false,
    },

    {
      _id: "3",
      title: "Hackathon Registration",
      description:
        "Register for the upcoming hackathon.",
      date: "2026-09-05",
      type: "deadline",
      completed: true,
    },
  ]);

  const toggleReminder = (id) => {
    setReminders((previous) =>
      previous.map((reminder) =>
        reminder._id === id
          ? {
              ...reminder,
              completed: !reminder.completed,
            }
          : reminder
      )
    );
  };

  const pendingCount = reminders.filter(
    (reminder) => !reminder.completed
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:ml-60 md:px-8 lg:px-10">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

        <div>
          <p className="mb-2 text-sm font-semibold text-indigo-600">
            STAY ON TRACK
          </p>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Reminders 🔔
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Stay on top of your deadlines and pending actions.
          </p>
        </div>

        <div className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
          {pendingCount} pending
        </div>
      </div>

      {/* Reminder list */}
      <div className="max-w-4xl space-y-4">

        {reminders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">

            <div className="text-5xl">
              🎉
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              You're all caught up!
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You don't have any pending reminders.
            </p>

          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition sm:flex-row sm:items-center ${
                reminder.completed
                  ? "border-slate-200 opacity-60"
                  : "border-slate-200 hover:shadow-md"
              }`}
            >

              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                  reminder.type === "deadline"
                    ? "bg-red-50"
                    : "bg-indigo-50"
                }`}
              >
                {reminder.type === "deadline"
                  ? "⏰"
                  : "✅"}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`font-bold ${
                      reminder.completed
                        ? "text-slate-400 line-through"
                        : "text-slate-900"
                    }`}
                  >
                    {reminder.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      reminder.type === "deadline"
                        ? "bg-red-50 text-red-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    {reminder.type}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {reminder.description}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  Due:{" "}
                  {new Date(
                    reminder.date
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() =>
                  toggleReminder(reminder._id)
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  reminder.completed
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {reminder.completed
                  ? "Completed ✓"
                  : "Mark Done"}
              </button>

            </div>
          ))
        )}

      </div>
    </main>
  );
};

export default Reminders;