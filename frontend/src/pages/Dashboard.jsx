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
      Person 1 will connect this to:

      GET /api/dashboard

      through api.js.

      For now, we use sample data.
    */

    const sampleData = {
      user: {
        name: "Student",
      },

      notices: [
        {
          _id: "1",
          title: "Campus Placement Drive",
          noticeType: "Placement",
          summary:
            "Campus placement opportunity for eligible final-year students.",
          urgency: "urgent",
          progress: 60,
          deadlines: [
            {
              title: "Registration Deadline",
              date: "2026-08-30",
            },
          ],
        },
      ],

      deadlines: [
        {
          _id: "1",
          title: "Placement Registration",
          date: "2026-08-30",
        },
      ],

      tasks: [
        {
          _id: "1",
          title: "Update Resume",
          description: "Prepare your latest resume.",
          status: "completed",
          priority: "high",
        },
        {
          _id: "2",
          title: "Upload Marksheet",
          description: "Upload your latest marksheet.",
          status: "pending",
          priority: "high",
        },
        {
          _id: "3",
          title: "Submit Application",
          description: "Complete the placement application.",
          status: "pending",
          priority: "urgent",
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
          "Your placement registration deadline is approaching.",
      },
    };

    setTimeout(() => {
      setDashboard(sampleData);
      setLoading(false);
    }, 500);
  }, []);

  const handleTaskToggle = (taskId) => {
    setDashboard((prev) => ({
      ...prev,

      tasks: prev.tasks.map((task) =>
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
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome back, {dashboard.user.name} 👋
          </h1>

          <p>
            Here is what you need to take action on today.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📄</span>
          <div>
            <h3>{dashboard.stats.totalNotices}</h3>
            <p>Total Notices</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <h3>{dashboard.stats.pendingTasks}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <h3>{dashboard.stats.completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <div>
            <h3>{dashboard.stats.progress}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Next Best Action */}

      {dashboard.nextBestAction && (
        <section className="next-action-section">
          <div className="next-action-card">
            <div className="next-action-icon">🧠</div>

            <div className="next-action-content">
              <span className="section-label">
                NEXT BEST ACTION
              </span>

              <h2>
                {dashboard.nextBestAction.title}
              </h2>

              <p>
                {dashboard.nextBestAction.reason}
              </p>
            </div>

            <button className="action-button">
              Take Action →
            </button>
          </div>
        </section>
      )}

      {/* Main content */}

      <div className="dashboard-grid">

        {/* Notices */}

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Your Notices</h2>
              <p>Notices that require your attention.</p>
            </div>
          </div>

          {dashboard.notices.length === 0 ? (
            <div className="empty-state">
              <span>📄</span>
              <h3>No notices yet</h3>
              <p>Upload a notice to get started.</p>
            </div>
          ) : (
            <div className="notice-list">
              {dashboard.notices.map((notice) => (
                <NoticeCard
                  key={notice._id}
                  notice={notice}
                />
              ))}
            </div>
          )}
        </section>

        {/* Deadlines */}

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Upcoming Deadlines</h2>
              <p>Don't miss an important date.</p>
            </div>
          </div>

          <div className="deadline-list">
            {dashboard.deadlines.length === 0 ? (
              <div className="empty-state">
                <span>🎉</span>
                <p>No upcoming deadlines.</p>
              </div>
            ) : (
              dashboard.deadlines.map((deadline) => (
                <DeadlineCard
                  key={deadline._id}
                  deadline={deadline}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Tasks */}

      <section className="dashboard-section tasks-section">
        <div className="section-header">
          <div>
            <h2>Action Checklist</h2>
            <p>Complete your pending tasks.</p>
          </div>
        </div>

        <div className="task-list">
          {dashboard.tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleTaskToggle}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;