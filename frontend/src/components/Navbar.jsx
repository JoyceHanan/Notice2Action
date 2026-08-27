import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || user?.username || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 h-[70px] border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-sm">
              N
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold leading-none text-slate-900">Notice2Action</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Turn notices into action</p>
            </div>
          </Link>
        </div>

        {/* Right — upload CTA + user + logout */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Quick upload button */}
          <Link
            to="/upload"
            className="hidden items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:flex"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Upload Notice
          </Link>

          {/* User info */}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none text-slate-800">
              {user?.name || user?.username || "Student"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">Student</p>
          </div>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-2 ring-indigo-200">
            {initials}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;