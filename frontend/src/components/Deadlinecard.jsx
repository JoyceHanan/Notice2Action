import React from "react";

const DeadlineCard = ({ deadline }) => {
  const deadlineDate = new Date(deadline.date);
  const today = new Date();

  const difference =
    deadlineDate.getTime() - today.getTime();

  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  let status = {
    container: "border-slate-200 bg-slate-50",
    icon: "bg-slate-100",
    text: "text-slate-600",
  };

  if (daysRemaining <= 1) {
    status = {
      container: "border-red-200 bg-red-50",
      icon: "bg-red-100",
      text: "text-red-600",
    };
  } else if (daysRemaining <= 3) {
    status = {
      container: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100",
      text: "text-amber-600",
    };
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 ${status.container}`}
    >
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${status.icon}`}
      >
        ⏰
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-slate-900">
          {deadline.title}
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          {deadlineDate.toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )}
        </p>
      </div>

      {/* Remaining */}
      <div className="text-right">
        <p
          className={`text-xs font-bold ${status.text}`}
        >
          {daysRemaining < 0
            ? "Passed"
            : daysRemaining === 0
            ? "Today"
            : `${daysRemaining}d left`}
        </p>
      </div>
    </div>
  );
};

export default DeadlineCard;