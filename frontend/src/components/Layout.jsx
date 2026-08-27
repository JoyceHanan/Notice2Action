import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./SideBar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navbar */}
      <Navbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Page content — offset for navbar + sidebar */}
      <div className="pt-[70px] md:pl-60">
        <div className="min-h-[calc(100vh-70px)]">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
