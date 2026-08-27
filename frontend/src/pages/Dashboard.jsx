import React, { useEffect, useState } from "react";

import NoticeCard from "../components/NoticeCard";
import DeadlineCard from "../components/Deadlinecard";
import TaskItem from "../components/TaskItem";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    user: {
      name: "Student",
    },

    notices: [],

    deadlines: [],

    tasks: [],

    stats: {
      totalNotices: 0,
      completedTasks: 0,
      pendingTasks: 0,
      progress: 0,
    },

    nextBestAction: null,
  });

  useEffect(() => {
    /*
      TEMPORARY DATA

      Person 1 will replace this with:

      const response = await api.get("/dashboard");

      once api.js is connected to the backend.
    */

    const sampleData = {
      user: {
        name: "Alex",
      },

      notices: [
        {
          _id: "notice-1",
          title: "Campus Placement Drive",
          noticeType: "Placement",
          summary:
            "Campus placement opportunity for eligible final-year students. Students must register before the deadline and upload the required documents.",
          urgency: "urgent",
          progress: 60,
          deadlines: [
            {
              title: "Registration Deadline",
              date: "2026-08-30",
            },
          ],
        },

        {
          _id: "notice-2",
          title: "Hackathon Registration",
          noticeType: "Event",
          summary:
            "Students can register for the upcoming inter-college hackathon.",
          urgency: "medium",
          progress: 30,
          deadlines: [
            {
              title: "Registration Deadline",
              date: "2026-09-05",
            },
          ],
        },
      ],

      deadlines: [
        {
          _id: "deadline-1",
          title: "Placement Registration",
          date: "2026-08-30",
        },

        {
          _id: "deadline-2",
          title: "Upload Marksheet",
          date: "2026-08-31",
        },

        {
          _id: "deadline-3",
          title: "Hackathon Registration",
          date: "2026-09-05",
        },
      ],

      tasks: [
        {
          _id: "task-1",
          title: "Update Resume",
          description:
            "Prepare your latest resume.",
          status: "completed",
          priority: "high",
        },

        {
          _id: "task-2",
          title: "Upload Marksheet",
          description:
            "Upload your latest marksheet.",
          status: "pending",
          priority: "high",
          deadline: "2026-08-31",
        },

        {
          _id: "task-3",
          title: "Submit Application",
          description:
            "Complete the placement application.",
          status: "pending",
          priority: "urgent",
          deadline: "2026-08-30",
        },

        {
          _id: "task-4",
          title: "Verify Contact Details",
          description:
            "Make sure your phone number and email are correct.",
          status: "pending",
          priority: "medium",
        },
      ],

      stats: {
        totalNotices: 5,
        completedTasks: 8,
        pendingTasks: 4,
        progress: 67,
      },

      nextBestAction: {
        title: "Upload your marksheet",
        reason:
          "Your placement registration deadline is approaching and this task is required before submission.",
      },
    };

    setTimeout(() => {
      setDashboard(sampleData);
      setLoading(false);
    }, 700);
  }, []);

  const handleTaskToggle = (taskId) => {
    setDashboard((previous) => ({
      ...previous,

      tasks: previous.tasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "pending"
                  : "completed",
            }
          : task
      ),
    }));
  };

  if (loading) {
    return (
      <Loading message="Preparing your action plan..." />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:ml-60 md:px-8 lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-indigo-600">
          YOUR ACTION CENTER
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {dashboard.user.name} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Here is what you need to take action on today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Notices
            </span>

            <span className="text-xl">📄</span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats.totalNotices}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Stored in your account
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Pending Tasks
            </span>

            <span className="text-xl">⏳</span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats.pendingTasks}
          </p>

          <p className="mt-1 text-xs text-orange-500">
            Need your attention
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Completed
            </span>

            <span className="text-xl">✅</span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats.completedTasks}
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            Tasks completed
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Overall Progress
            </span>

            <span className="text-xl">📈</span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats.progress}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{
                width: `${dashboard.stats.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Next Best Action */}
      {dashboard.nextBestAction && (
        <section className="mb-8">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                🧠
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Next Best Action
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                  {dashboard.nextBestAction.title}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {dashboard.nextBestAction.reason}
                </p>
              </div>

              <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Take Action →
              </button>

            </div>
          </div>
        </section>
      )}

      {/* Two column section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">

        {/* Notices */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Notices
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Notices requiring your attention.
              </p>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              {dashboard.notices.length}
            </span>
          </div>

          <div className="space-y-4">
            {dashboard.notices.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-4xl">📄</div>

                <h3 className="mt-3 font-semibold text-slate-800">
                  No notices yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a notice to get started.
                </p>
              </div>
            ) : (
              dashboard.notices.map((notice) => (
                <NoticeCard
                  key={notice._id}
                  notice={notice}
                />
              ))
            )}
          </div>
        </section>

        {/* Deadlines */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Upcoming Deadlines
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Don't miss an important date.
            </p>
          </div>

          <div className="space-y-3">
            {dashboard.deadlines.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-4xl">🎉</div>

                <p className="mt-3 text-sm text-slate-500">
                  No upcoming deadlines.
                </p>
              </div>
            ) : (
              dashboard.deadlines.map(
                (deadline) => (
                  <DeadlineCard
                    key={deadline._id}
                    deadline={deadline}
                  />
                )
              )
            )}
          </div>
        </section>
      </div>

      {/* Tasks */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Action Checklist
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete your pending tasks.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {dashboard.tasks.length} tasks
          </span>
        </div>

        <div>
          {dashboard.tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleTaskToggle}
            />
          ))}
        </div>
      </section>

    </main>
  );
};

export default Dashboard;