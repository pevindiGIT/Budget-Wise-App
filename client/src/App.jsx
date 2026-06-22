import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import ProtectedRoute from "./components/ProtectedRoute";

/** Redirect authenticated users away from auth pages */
function PublicOnlyRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses"  element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/income"    element={<ProtectedRoute><Income /></ProtectedRoute>} />
      <Route path="/budgets"   element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
      <Route path="/goals"     element={<ProtectedRoute><Goals /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
