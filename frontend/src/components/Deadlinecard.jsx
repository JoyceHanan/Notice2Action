import React from "react";

const DeadlineCard = ({ deadline }) => {
  const deadlineDate = new Date(deadline.date);
  const today = new Date();

  const difference = deadlineDate - today;
  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  let urgency = "normal";

  if (daysRemaining <= 1) {
    urgency = "urgent";
  } else if (daysRemaining <= 3) {
    urgency = "warning";
  }

  return (
    <div className={`deadline-card ${urgency}`}>
      <div className="deadline-icon">⏰</div>

      <div className="deadline-content">
        <h4>{deadline.title}</h4>

        <p>
          {deadlineDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>

        <span className="days-left">
          {daysRemaining < 0
            ? "Deadline passed"
            : daysRemaining === 0
            ? "Due today"
            : `${daysRemaining} day${
                daysRemaining > 1 ? "s" : ""
              } remaining`}
        </span>
      </div>
    </div>
  );
};

export default DeadlineCard;