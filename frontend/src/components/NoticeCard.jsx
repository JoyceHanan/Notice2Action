import React from "react";
import { useNavigate } from "react-router-dom";

const NoticeCard = ({ notice }) => {
  const navigate = useNavigate();

  const getUrgencyClass = (urgency) => {
    if (urgency === "high" || urgency === "urgent") {
      return "urgent";
    }

    if (urgency === "medium") {
      return "medium";
    }

    return "low";
  };

  const deadline = notice?.deadlines?.[0];

  return (
    <div className="notice-card">
      <div className="notice-card-header">
        <div>
          <h3>{notice?.title || "Untitled Notice"}</h3>
          <p className="notice-type">
            {notice?.noticeType || "General Notice"}
          </p>
        </div>

        {notice?.urgency && (
          <span className={`urgency-badge ${getUrgencyClass(notice.urgency)}`}>
            {notice.urgency}
          </span>
        )}
      </div>

      <p className="notice-summary">
        {notice?.summary || "No summary available."}
      </p>

      {deadline && (
        <div className="notice-deadline">
          <span>⏰ Deadline</span>
          <strong>
            {new Date(deadline.date).toLocaleDateString()}
          </strong>
        </div>
      )}

      <div className="notice-progress">
        <div className="progress-info">
          <span>Action Progress</span>
          <span>{notice?.progress || 0}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${notice?.progress || 0}%` }}
          />
        </div>
      </div>

      <button
        className="view-notice-btn"
        onClick={() => navigate(`/notices/${notice._id}`)}
      >
        View Notice →
      </button>
    </div>
  );
};

export default NoticeCard;