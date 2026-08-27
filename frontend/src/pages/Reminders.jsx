import React, { useEffect, useState } from "react";
import { getReminders } from "../api/api";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemindersData = async () => {
      try {
        setLoading(true);
        const res = await getReminders();
        const list = res.data || res.reminders || (Array.isArray(res) ? res : []);
        if (list.length > 0) {
          const normalized = list.map((r) => ({
            _id: r._id,
            title: r.title,
            description: r.message || r.description || "Upcoming deadline alert",
            date: r.reminderTime || r.date || new Date(),
            type: r.type || "deadline",
            completed: r.status === "completed" || r.status === "cancelled" || Boolean(r.completed),
          }));
          setReminders(normalized);
        } else {
          setReminders([]);
        }
      } catch (err) {
        console.log("Could not load reminders from API", err);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRemindersData();
  }, []);

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
    <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Notification & Alert Center
            </span>
            <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Reminders & Deadlines 🔔
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Never miss an action item extracted from your uploaded notices.
            </p>
          </div>

          <div className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-xs font-extrabold text-indigo-700">
            {pendingCount} Pending Action{pendingCount !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Reminder list */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-slate-500">
              Loading reminders...
            </div>
          ) : reminders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
              <div className="text-5xl">🎉</div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                You're all caught up!
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                You don't have any pending reminders right now.
              </p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder._id}
                className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition sm:flex-row sm:items-center ${
                  reminder.completed
                    ? "border-slate-200 opacity-60"
                    : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                    reminder.type === "deadline"
                      ? "bg-red-50 text-red-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {reminder.type === "deadline" ? "⏰" : "✅"}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-base font-bold ${
                        reminder.completed
                          ? "text-slate-400 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {reminder.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
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

                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    Due Date:{" "}
                    {new Date(reminder.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => toggleReminder(reminder._id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    reminder.completed
                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                  }`}
                >
                  {reminder.completed ? "Completed ✓" : "Mark Complete"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Reminders;