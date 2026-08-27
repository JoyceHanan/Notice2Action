import React, { useEffect, useState } from "react";

import NoticeCard from "../components/NoticeCard";
import DeadlineCard from "../components/Deadlinecard";
import TaskItem from "../components/TaskItem";
import Loading from "../components/Loading";

import {
  getDashboard,
  updateTask,
} from "../api/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    user: {
      name: "",
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

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await getDashboard();

        if (response.success) {
          setDashboard({
            user: response.data?.user || {
              name: "",
            },

            notices: response.data?.notices || [],

            deadlines:
              response.data?.deadlines || [],

            tasks:
              response.data?.tasks || [],

            stats:
              response.data?.stats || {
                totalNotices: 0,
                completedTasks: 0,
                pendingTasks: 0,
                progress: 0,
              },

            nextBestAction:
              response.data?.nextBestAction ||
              null,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error.response?.data?.message ||
            error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // =========================
  // UPDATE TASK STATUS
  // =========================

  const handleTaskToggle = async (taskId) => {
    try {
      const task = dashboard.tasks.find(
        (item) => item._id === taskId
      );

      if (!task) return;

      const newStatus =
        task.status === "completed"
          ? "pending"
          : "completed";

      await updateTask(taskId, {
        status: newStatus,
      });

      setDashboard((previous) => ({
        ...previous,

        tasks: previous.tasks.map((item) =>
          item._id === taskId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        ),
      }));
    } catch (error) {
      console.error(
        "Failed to update task:",
        error.response?.data?.message ||
          error.message
      );
    }
  };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <Loading message="Preparing your action plan..." />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:ml-60 md:px-8 lg:px-10">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-indigo-600">
          YOUR ACTION CENTER
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back,
          {dashboard.user?.name
            ? ` ${dashboard.user.name}`
            : ""}{" "}
          👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Here is what you need to take action on today.
        </p>
      </div>


      {/* ================= STATS ================= */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL NOTICES */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Total Notices
            </span>

            <span className="text-xl">
              📄
            </span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats?.totalNotices || 0}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Stored in your account
          </p>
        </div>


        {/* PENDING TASKS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Pending Tasks
            </span>

            <span className="text-xl">
              ⏳
            </span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats?.pendingTasks || 0}
          </p>

          <p className="mt-1 text-xs text-orange-500">
            Need your attention
          </p>
        </div>


        {/* COMPLETED TASKS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Completed
            </span>

            <span className="text-xl">
              ✅
            </span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats?.completedTasks || 0}
          </p>

          <p className="mt-1 text-xs text-emerald-600">
            Tasks completed
          </p>
        </div>


        {/* OVERALL PROGRESS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Overall Progress
            </span>

            <span className="text-xl">
              📈
            </span>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {dashboard.stats?.progress || 0}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{
                width: `${
                  dashboard.stats?.progress || 0
                }%`,
              }}
            />
          </div>
        </div>

      </div>


      {/* ================= NEXT BEST ACTION ================= */}

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
                  {
                    dashboard.nextBestAction
                      ?.title
                  }
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {
                    dashboard.nextBestAction
                      ?.reason
                  }
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Take Action →
              </button>

            </div>
          </div>
        </section>
      )}


      {/* ================= NOTICES + DEADLINES ================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">

        {/* NOTICES */}

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

                <div className="text-4xl">
                  📄
                </div>

                <h3 className="mt-3 font-semibold text-slate-800">
                  No notices yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a notice to get started.
                </p>

              </div>

            ) : (

              dashboard.notices.map(
                (notice) => (
                  <NoticeCard
                    key={notice._id}
                    notice={notice}
                  />
                )
              )

            )}

          </div>

        </section>


        {/* DEADLINES */}

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

                <div className="text-4xl">
                  🎉
                </div>

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


      {/* ================= ACTION CHECKLIST ================= */}

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


        {dashboard.tasks.length === 0 ? (

          <div className="py-10 text-center">

            <div className="text-4xl">
              ✅
            </div>

            <h3 className="mt-3 font-semibold text-slate-800">
              No tasks yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tasks will appear here after a notice is processed.
            </p>

          </div>

        ) : (

          <div>

            {dashboard.tasks.map(
              (task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={handleTaskToggle}
                />
              )
            )}

          </div>

        )}

      </section>

    </main>
  );
};

export default Dashboard;