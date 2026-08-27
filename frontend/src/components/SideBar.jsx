import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Upload Notice",
    path: "/upload",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    name: "Reminders",
    path: "/reminders",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    name: "Profile",
    path: "/profile",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-[70px] z-40 h-[calc(100vh-70px)] w-60 border-r border-slate-200 bg-white transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="flex h-full flex-col px-3 py-5">

        {/* Label */}
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Navigation
        </p>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                  ${isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className={`shrink-0 transition ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom promo + logout */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            <p className="text-sm font-bold text-indigo-900">Stay on track 🚀</p>
            <p className="mt-1 text-xs leading-5 text-indigo-600">
              Upload a notice and let AI build your action plan.
            </p>
            <Link
              to="/upload"
              onClick={onClose}
              className="mt-3 block rounded-lg bg-indigo-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-indigo-700"
            >
              + New Notice
            </Link>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;