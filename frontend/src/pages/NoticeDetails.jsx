import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import {
  askNoticeQuestion,
  getNoticeById,
  updateTask,
} from "../api/api";

function NoticeDetails() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const data = await getNoticeById(id);
      setNotice(data.data || data.notice || data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load notice analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";

      await updateTask(task._id, { status: newStatus });

      setNotice((prev) => ({
        ...prev,
        actionItems: prev.actionItems.map((item) =>
          item._id === task._id ? { ...item, status: newStatus } : item
        ),
      }));
    } catch {
      alert("Failed to update task status.");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setAsking(true);
      const data = await askNoticeQuestion(id, question);
      setAnswer(data.answer || data.response || "No response received.");
    } catch (err) {
      setAnswer(err.response?.data?.message || "Unable to answer the question.");
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">Analyzing notice document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <div className="text-4xl">⚠️</div>
          <h3 className="mt-3 font-bold text-red-800">Error Loading Notice</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <Link
            to="/dashboard"
            className="mt-5 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Back Link & Header */}
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-3"
          >
            ← Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {notice.noticeType || "General Notice"}
              </span>
              {notice.urgency && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                  notice.urgency === "urgent" ? "bg-red-50 text-red-600 ring-1 ring-red-200" :
                  notice.urgency === "high" ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200" :
                  "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                }`}>
                  Urgency: {notice.urgency}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {notice.title || "Notice Details"}
            </h1>
          </div>
        </div>

        {/* AI SUMMARY */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              🤖
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">AI Summary</h2>
          </div>

          <p className="mt-4 leading-7 text-slate-600">
            {notice.summary || "Summary is not available for this notice."}
          </p>

          {notice.importantPoints?.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-800">Key Highlights</h3>
              <ul className="mt-3 space-y-2">
                {notice.importantPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ELIGIBILITY CRITERIA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              🎯
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Eligibility Analysis</h2>
          </div>

          {notice.eligibility ? (
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase ${
                  notice.eligibility.status?.toLowerCase().includes("eligible")
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  Status: {notice.eligibility.status}
                </span>
              </div>

              {notice.eligibility.reasons?.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {notice.eligibility.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No explicit eligibility requirements specified in this notice.</p>
          )}
        </section>

        {/* DEADLINES */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              ⏰
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Extracted Deadlines</h2>
          </div>

          {notice.deadlines?.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {notice.deadlines.map((deadline, index) => (
                <div key={deadline._id || index} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <h3 className="font-bold text-slate-900">{deadline.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {deadline.date ? new Date(deadline.date).toLocaleDateString("en-IN", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric"
                    }) : "Date not specified"}
                  </p>
                  {deadline.urgency && (
                    <span className="mt-3 inline-block text-[11px] font-bold text-orange-600 uppercase">
                      Urgency: {deadline.urgency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No specific deadlines detected in this notice.</p>
          )}
        </section>

        {/* ACTION CHECKLIST */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              ✅
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Generated Action Checklist</h2>
          </div>

          {notice.actionItems?.length > 0 ? (
            <div className="mt-5 space-y-3">
              {notice.actionItems.map((task, index) => (
                <div
                  key={task._id || index}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition ${
                    task.status === "completed"
                      ? "border-slate-200 bg-slate-50/60 opacity-70"
                      : "border-slate-200 bg-white shadow-sm hover:border-indigo-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleTaskToggle(task)}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-sm font-bold ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-xs text-slate-500">{task.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No action items created for this notice.</p>
          )}
        </section>

        {/* ASK AI ABOUT THIS NOTICE */}
        <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              💬
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Ask Questions About This Notice</h2>
              <p className="text-xs text-slate-500">Get immediate AI answers based on the notice document</p>
            </div>
          </div>

          <form onSubmit={handleAskQuestion} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What documents are required for application?"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
            <button
              type="submit"
              disabled={asking}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
            >
              {asking ? "Thinking..." : "Ask AI"}
            </button>
          </form>

          {answer && (
            <div className="mt-5 rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">AI Response</span>
              <p className="mt-2 text-sm leading-6 text-slate-700">{answer}</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default NoticeDetails;