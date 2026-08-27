import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-[70px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
            N
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Notice2Action
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              Turn notices into action
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || user?.username || "Student"}
            </p>

            <p className="text-xs text-slate-500">
              Student
            </p>
          </div>

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            {(user?.name || "S").charAt(0).toUpperCase()}
          </div>

          <button
            onClick={onLogout}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;