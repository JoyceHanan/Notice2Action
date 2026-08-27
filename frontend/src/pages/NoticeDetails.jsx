import { useEffect, useState } from "react";
import { useParams } from "react-router";

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

      setNotice(data.notice || data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load notice."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (task) => {
    try {
      const newStatus =
        task.status === "completed"
          ? "pending"
          : "completed";

      await updateTask(task._id, {
        status: newStatus,
      });

      setNotice((prev) => ({
        ...prev,
        actionItems: prev.actionItems.map((item) =>
          item._id === task._id
            ? { ...item, status: newStatus }
            : item
        ),
      }));
    } catch {
      alert("Failed to update task.");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      setAsking(true);

      const data = await askNoticeQuestion(id, question);

      setAnswer(
        data.answer ||
        data.response ||
        "No answer received."
      );

    } catch (err) {
      setAnswer(
        err.response?.data?.message ||
        "Unable to answer the question."
      );
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-600">
          Loading notice analysis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-xl bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-indigo-600">
            NOTICE ANALYSIS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            {notice.title || "Notice Details"}
          </h1>

          {notice.noticeType && (
            <span className="mt-4 inline-block rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
              {notice.noticeType}
            </span>
          )}
        </div>


        {/* AI SUMMARY */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            🤖 AI Summary
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            {notice.summary ||
              "Summary is not available."}
          </p>

          {notice.importantPoints?.length > 0 && (
            <div className="mt-5">

              <h3 className="font-semibold text-slate-700">
                Important Points
              </h3>

              <ul className="mt-3 space-y-2">
                {notice.importantPoints.map((point, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-slate-50 p-3 text-slate-600"
                  >
                    • {point}
                  </li>
                ))}
              </ul>

            </div>
          )}
        </section>


        {/* ELIGIBILITY */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            🎯 Your Eligibility
          </h2>

          {notice.eligibility ? (
            <div className="mt-4">

              <span className="inline-block rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                {notice.eligibility.status}
              </span>

              {notice.eligibility.reasons?.length > 0 && (
                <ul className="mt-4 space-y-2">

                  {notice.eligibility.reasons.map(
                    (reason, index) => (
                      <li
                        key={index}
                        className="text-slate-600"
                      >
                        • {reason}
                      </li>
                    )
                  )}

                </ul>
              )}

            </div>
          ) : (
            <p className="mt-4 text-slate-500">
              Eligibility information is not available.
            </p>
          )}

        </section>


        {/* NEXT BEST ACTION */}
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

          <h2 className="text-xl font-bold text-indigo-800">
            🧠 Next Best Action
          </h2>

          {notice.nextBestAction ? (
            <div className="mt-4">

              <h3 className="text-lg font-semibold text-slate-800">
                {notice.nextBestAction.action}
              </h3>

              <p className="mt-2 text-slate-600">
                {notice.nextBestAction.reason}
              </p>

            </div>
          ) : (
            <p className="mt-4 text-slate-600">
              No pending action at the moment.
            </p>
          )}

        </section>


        {/* DEADLINES */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            ⏰ Important Deadlines
          </h2>

          {notice.deadlines?.length > 0 ? (

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {notice.deadlines.map((deadline, index) => (

                <div
                  key={deadline._id || index}
                  className="rounded-xl border border-slate-200 p-4"
                >

                  <h3 className="font-semibold text-slate-800">
                    {deadline.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {deadline.date
                      ? new Date(deadline.date).toLocaleString()
                      : "Date not specified"}
                  </p>

                  <p className="mt-3 text-sm font-medium text-orange-600">
                    {deadline.urgency || "Normal"}
                  </p>

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-4 text-slate-500">
              No deadlines found.
            </p>

          )}

        </section>


        {/* ACTION CHECKLIST */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            ✅ Action Checklist
          </h2>

          {notice.actionItems?.length > 0 ? (

            <div className="mt-5 space-y-3">

              {notice.actionItems.map((task, index) => (

                <div
                  key={task._id || index}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 p-4"
                >

                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => handleTaskToggle(task)}
                    className="mt-1 h-5 w-5 accent-indigo-600"
                  />

                  <div>

                    <h3
                      className={`font-semibold ${
                        task.status === "completed"
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {task.description}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-4 text-slate-500">
              No action items generated.
            </p>

          )}

        </section>


        {/* ROADMAP */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            🔗 Action Roadmap
          </h2>

          {notice.roadmap?.length > 0 ? (

            <ol className="mt-5 space-y-3">

              {notice.roadmap.map((step, index) => (

                <li
                  key={index}
                  className="flex gap-4"
                >

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>

                  <div className="pt-1 text-slate-700">
                    {step.title || step}
                  </div>

                </li>

              ))}

            </ol>

          ) : (

            <p className="mt-4 text-slate-500">
              Roadmap information is not available.
            </p>

          )}

        </section>


        {/* WARNINGS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            🚨 Warnings & Missing Information
          </h2>

          {notice.warnings?.length > 0 ? (

            <div className="mt-5 space-y-3">

              {notice.warnings.map((warning, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-yellow-200 bg-yellow-50 p-4"
                >

                  <p className="font-semibold text-yellow-800">
                    {warning.type || "Warning"}
                  </p>

                  <p className="mt-1 text-sm text-yellow-700">
                    {warning.message || warning}
                  </p>

                </div>

              ))}

            </div>

          ) : (

            <p className="mt-4 text-slate-500">
              No contradictions or missing information detected.
            </p>

          )}

        </section>


        {/* ASK THE NOTICE */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-800">
            💬 Ask the Notice
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ask any question related to this notice.
          </p>

          <form
            onSubmit={handleAskQuestion}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: What documents do I need?"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              disabled={asking}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {asking ? "Thinking..." : "Ask"}
            </button>

          </form>

          {answer && (

            <div className="mt-6 rounded-xl bg-indigo-50 p-5">

              <p className="font-semibold text-indigo-800">
                AI Answer
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {answer}
              </p>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default NoticeDetails;