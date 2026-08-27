import React from "react";
import { useNavigate } from "react-router";

const NoticeCard = ({ notice }) => {
  const navigate = useNavigate();

  const urgencyStyles = {
    urgent: "bg-red-50 text-red-700 ring-red-200",
    high: "bg-orange-50 text-orange-700 ring-orange-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  const urgency =
    notice?.urgency?.toLowerCase() || "low";

  const deadline = notice?.deadlines?.[0];

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {notice?.noticeType || "General Notice"}
          </p>

          <h3 className="truncate text-lg font-bold text-slate-900">
            {notice?.title || "Untitled Notice"}
          </h3>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${
            urgencyStyles[urgency] ||
            urgencyStyles.low
          }`}
        >
          {urgency}
        </span>
      </div>

      {/* Summary */}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
        {notice?.summary ||
          "No summary available for this notice."}
      </p>

      {/* Deadline */}
      {deadline && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

          <div className="flex items-center gap-2">
            <span>⏰</span>

            <span className="text-sm text-slate-600">
              {deadline.title || "Deadline"}
            </span>
          </div>

          <span className="text-sm font-semibold text-slate-900">
            {new Date(
              deadline.date
            ).toLocaleDateString("en-IN")}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="mt-5">

        <div className="mb-2 flex justify-between text-xs">
          <span className="font-medium text-slate-600">
            Action Progress
          </span>

          <span className="font-bold text-indigo-600">
            {notice?.progress || 0}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${notice?.progress || 0}%`,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() =>
          navigate(`/notices/${notice._id}`)
        }
        className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
      >
        View Notice →
      </button>
    </div>
  );
};

export default NoticeCard;