import React from "react";
import { Link, useLocation } from "react-router";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Upload Notice",
      path: "/upload",
      icon: "📄",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "👤",
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: "🔔",
    },
  ];

  return (
    <aside className="fixed left-0 top-[70px] hidden h-[calc(100vh-70px)] w-60 border-r border-slate-200 bg-white md:block">

      <div className="flex h-full flex-col px-4 py-6">

        <div className="mb-6 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="mt-auto rounded-xl bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-900">
            Stay organized 🚀
          </p>

          <p className="mt-1 text-xs leading-5 text-indigo-700">
            Complete your tasks before the deadlines.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;