import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadNotice from "./pages/UploadNotice";
import NoticeDetails from "./pages/NoticeDetails";

// Person 2 pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadNotice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notices/:id"
        element={
          <ProtectedRoute>
            <NoticeDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <Reminders />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;