import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setAuth } from "../lib/auth";
import { useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setAuth({ token: data.token, user: data.user });
      window.dispatchEvent(new Event("dressup_auth_changed"));
      navigate(from, { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-muted">Welcome back to DressUp.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
            />

            <button
              disabled={loading}
              className="mt-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-muted">
            Don’t have an account?{" "}
            <Link className="text-text underline" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
