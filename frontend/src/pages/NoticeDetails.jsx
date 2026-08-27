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

      // Adjust according to backend response
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

      setNotice((prevNotice) => ({
        ...prevNotice,
        actionItems: prevNotice.actionItems.map((item) =>
          item._id === task._id
            ? { ...item, status: newStatus }
            : item
        ),
      }));
    } catch (err) {
      alert("Failed to update task.");
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    try {
      setAsking(true);

      const data = await askNoticeQuestion(
        id,
        question
      );

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
    return <div>Loading notice...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!notice) {
    return <div>Notice not found.</div>;
  }

  const eligibility = notice.eligibility;

  return (
    <div className="notice-details-page">

      {/* HEADER */}
      <section className="notice-header">
        <h1>{notice.title || "Notice Details"}</h1>

        {notice.noticeType && (
          <p>
            Type: {notice.noticeType}
          </p>
        )}
      </section>


      {/* SUMMARY */}
      <section className="notice-section">
        <h2>🤖 AI Summary</h2>

        <p>
          {notice.summary ||
            "Summary is not available."}
        </p>

        {notice.importantPoints?.length > 0 && (
          <>
            <h3>Important Points</h3>

            <ul>
              {notice.importantPoints.map(
                (point, index) => (
                  <li key={index}>{point}</li>
                )
              )}
            </ul>
          </>
        )}
      </section>


      {/* ELIGIBILITY */}
      <section className="notice-section">
        <h2>🎯 Your Eligibility</h2>

        {eligibility ? (
          <>
            <h3>
              {eligibility.status}
            </h3>

            {eligibility.reasons?.length > 0 && (
              <ul>
                {eligibility.reasons.map(
                  (reason, index) => (
                    <li key={index}>
                      {reason}
                    </li>
                  )
                )}
              </ul>
            )}
          </>
        ) : (
          <p>
            Eligibility information is not available.
          </p>
        )}
      </section>


      {/* NEXT BEST ACTION */}
      <section className="notice-section">
        <h2>🧠 Next Best Action</h2>

        {notice.nextBestAction ? (
          <>
            <h3>
              {notice.nextBestAction.action}
            </h3>

            <p>
              {notice.nextBestAction.reason}
            </p>
          </>
        ) : (
          <p>
            No pending action at the moment.
          </p>
        )}
      </section>


      {/* DEADLINES */}
      <section className="notice-section">
        <h2>⏰ Important Deadlines</h2>

        {notice.deadlines?.length > 0 ? (
          <div>
            {notice.deadlines.map((deadline) => (
              <div
                className="deadline-item"
                key={deadline._id}
              >
                <h3>{deadline.title}</h3>

                <p>
                  {deadline.date
                    ? new Date(
                        deadline.date
                      ).toLocaleString()
                    : "Date not specified"}
                </p>

                <p>
                  Priority:{" "}
                  {deadline.urgency || "Normal"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No deadlines found.</p>
        )}
      </section>


      {/* ACTION CHECKLIST */}
      <section className="notice-section">
        <h2>✅ Your Action Checklist</h2>

        {notice.actionItems?.length > 0 ? (
          <div>
            {notice.actionItems.map((task) => (
              <div
                className="task-item"
                key={task._id}
              >
                <input
                  type="checkbox"
                  checked={
                    task.status === "completed"
                  }
                  onChange={() =>
                    handleTaskToggle(task)
                  }
                />

                <div>
                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>
                      {task.description}
                    </p>
                  )}

                  {task.priority && (
                    <span>
                      Priority: {task.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>
            No action items generated.
          </p>
        )}
      </section>


      {/* ROADMAP */}
      <section className="notice-section">
        <h2>🔗 Action Roadmap</h2>

        {notice.roadmap?.length > 0 ? (
          <ol>
            {notice.roadmap.map(
              (step, index) => (
                <li key={index}>
                  {step.title || step}
                </li>
              )
            )}
          </ol>
        ) : (
          <p>
            Complete the checklist in the recommended order.
          </p>
        )}
      </section>


      {/* WARNINGS */}
      <section className="notice-section">
        <h2>🚨 Warnings & Missing Information</h2>

        {notice.warnings?.length > 0 ? (
          <div>
            {notice.warnings.map(
              (warning, index) => (
                <div
                  className="warning-item"
                  key={index}
                >
                  <strong>
                    {warning.type}
                  </strong>

                  <p>
                    {warning.message}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p>
            No contradictions or missing information detected.
          </p>
        )}
      </section>


      {/* ASK THE NOTICE */}
      <section className="notice-section">
        <h2>💬 Ask the Notice</h2>

        <form onSubmit={handleAskQuestion}>
          <input
            type="text"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask something about this notice..."
          />

          <button
            type="submit"
            disabled={asking}
          >
            {asking ? "Thinking..." : "Ask"}
          </button>
        </form>

        {answer && (
          <div className="ai-answer">
            <h3>Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </section>

    </div>
  );
}

export default NoticeDetails;