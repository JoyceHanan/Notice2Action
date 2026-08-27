import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import NoticeCard from "../components/NoticeCard";
import DeadlineCard from "../components/DeadlineCard";
import TaskItem from "../components/TaskItem";
import Loading from "../components/Loading";

import {
  getDashboard,
  updateTask,
} from "../api/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState("all"); // 'all' | 'pending' | 'completed'

  const [dashboard, setDashboard] = useState({
    user: { name: "" },
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
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();

        if (response.success) {
          setDashboard({
            user: response.data?.user || { name: "" },
            notices: response.data?.notices || [],
            deadlines: response.data?.deadlines || [],
            tasks: response.data?.tasks || [],
            stats: response.data?.stats || {
              totalNotices: 0,
              completedTasks: 0,
              pendingTasks: 0,
              progress: 0,
            },
            nextBestAction: response.data?.nextBestAction || null,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleTaskToggle = async (taskId) => {
    try {
      const task = dashboard.tasks.find((item) => item._id === taskId);
      if (!task) return;

      const newStatus = task.status === "completed" ? "pending" : "completed";

      await updateTask(taskId, { status: newStatus });

      setDashboard((previous) => {
        const updatedTasks = previous.tasks.map((item) =>
          item._id === taskId ? { ...item, status: newStatus } : item
        );

        const completed = updatedTasks.filter((t) => t.status === "completed").length;
        const pending = updatedTasks.length - completed;
        const progress = updatedTasks.length > 0 ? Math.round((completed / updatedTasks.length) * 100) : 0;

        return {
          ...previous,
          tasks: updatedTasks,
          stats: {
            ...previous.stats,
            completedTasks: completed,
            pendingTasks: pending,
            progress: progress,
          },
        };
      });
    } catch (error) {
      console.error(
        "Failed to update task:",
        error.response?.data?.message || error.message
      );
    }
  };

  if (loading) {
    return <Loading message="Preparing your action plan..." />;
  }

  const filteredTasks = dashboard.tasks.filter((t) => {
    if (taskFilter === "pending") return t.status !== "completed";
    if (taskFilter === "completed") return t.status === "completed";
    return true;
  });

  return (
    <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Personalized Dashboard
            </span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {dashboard.user?.name || "Student"} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here is your AI-curated action plan and upcoming deadlines.
            </p>
          </div>

          <Link
            to="/upload"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Upload New Notice
          </Link>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Notices */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-indigo-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Notices</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                📄
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {dashboard.stats?.totalNotices || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400">Notices processed by AI</p>
          </div>

          {/* Pending Tasks */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Actions</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                ⏳
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {dashboard.stats?.pendingTasks || 0}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-600">Tasks needing completion</p>
          </div>

          {/* Completed Tasks */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                ✅
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {dashboard.stats?.completedTasks || 0}
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-600">Action items done</p>
          </div>

          {/* Progress */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="absolute left-0 top-0 h-full w-1.5 bg-purple-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completion Rate</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                📈
              </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">
              {dashboard.stats?.progress || 0}%
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${dashboard.stats?.progress || 0}%` }}
              />
            </div>
          </div>

        </div>

        {/* ================= NEXT BEST ACTION BANNER ================= */}
        {dashboard.nextBestAction && (
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                    🧠
                  </div>
                  <div>
                    <span className="inline-block rounded-md bg-indigo-500/30 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-indigo-200">
                      Recommended Next Action
                    </span>
                    <h2 className="mt-1 text-lg font-bold sm:text-xl text-white">
                      {dashboard.nextBestAction.title || dashboard.nextBestAction.action}
                    </h2>
                    <p className="mt-1 text-sm text-indigo-200">
                      {dashboard.nextBestAction.reason}
                    </p>
                  </div>
                </div>

                <Link
                  to={dashboard.nextBestAction.noticeId ? `/notices/${dashboard.nextBestAction.noticeId}` : "/upload"}
                  className="shrink-0 rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-indigo-900 shadow transition hover:bg-indigo-50 active:scale-[0.98]"
                >
                  Take Action →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ================= NOTICES + DEADLINES ================= */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* ACTIVE NOTICE */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Active Notice</h2>
                <p className="text-xs text-slate-500">Primary active notice & AI summary</p>
              </div>
              {dashboard.notices.length > 0 && (
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                  Active
                </span>
              )}
            </div>

            <div className="space-y-4">
              {dashboard.notices.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <div className="text-4xl">📄</div>
                  <h3 className="mt-3 font-bold text-slate-800">No notices uploaded yet</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Upload a notice document or paste notice text to generate actionable tasks.
                  </p>
                  <Link
                    to="/upload"
                    className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    + Upload First Notice
                  </Link>
                </div>
              ) : (
                <NoticeCard notice={dashboard.notices[0]} />
              )}
            </div>
          </section>

          {/* DEADLINES LIST */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Upcoming Deadlines</h2>
                <p className="text-xs text-slate-500">Sorted by urgency date</p>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                {dashboard.deadlines.length} due
              </span>
            </div>

            <div className="space-y-3">
              {dashboard.deadlines.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                  <div className="text-4xl">🎉</div>
                  <h3 className="mt-3 font-bold text-slate-800">No upcoming deadlines</h3>
                  <p className="mt-1 text-xs text-slate-500">You are all caught up!</p>
                </div>
              ) : (
                dashboard.deadlines.map((deadline) => (
                  <DeadlineCard key={deadline._id} deadline={deadline} />
                ))
              )}
            </div>
          </section>

        </div>

        {/* ================= ACTION CHECKLIST ================= */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Interactive Action Checklist</h2>
              <p className="text-xs text-slate-500">
                Check off items as you complete them to track overall progress.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {["all", "pending", "completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                    taskFilter === filter
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
              <div className="text-3xl">✅</div>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {taskFilter === "all"
                  ? "No action items in your checklist."
                  : `No ${taskFilter} tasks found.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={handleTaskToggle}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Dashboard;