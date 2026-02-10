import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setAuth } from "../lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
       setAuth({ token: data.token, user: data.user });
        window.dispatchEvent(new Event("dressup_auth_changed"));
        navigate("/checkout");
      navigate("/shop");
    } catch (err) {
      alert(err?.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-2xl font-semibold">Register</h1>
          <p className="mt-1 text-sm text-muted">Create your DressUp account.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              type="password"
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
            />

            <button
              disabled={loading}
              className="mt-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-muted">
            Already have an account?{" "}
            <Link className="text-text underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
