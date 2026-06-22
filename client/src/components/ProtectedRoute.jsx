import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "./ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return <Spinner className="min-h-screen" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
