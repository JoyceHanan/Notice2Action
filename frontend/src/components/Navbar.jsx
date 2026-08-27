import React from "react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">N</span>
        <span>Notice2Action</span>
      </div>

      <div className="navbar-right">
        <span className="user-name">
          {user?.name || user?.username || "Student"}
        </span>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;