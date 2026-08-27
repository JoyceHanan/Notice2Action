import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadNotice from "./pages/UploadNotice";
import NoticeDetails from "./pages/NoticeDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-slate-600">Loading Notice2Action...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
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