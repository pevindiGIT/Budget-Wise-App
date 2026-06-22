import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <Link to="/" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Sign in to BudgetWise</h1>
            <p className="text-sm text-gray-500 mt-1">Track your finances in one place</p>
          </div>

          {err && <div className="mb-4"><Alert>{err}</Alert></div>}

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center py-2.5"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
