import { Link, Outlet, useNavigate } from "react-router-dom";
import { getToken, getUser, isAdmin } from "../../lib/auth";
import { useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    if (!isAdmin()) {
      navigate("/");
      return;
    }
  }, [navigate]);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin</h1>
            <p className="mt-1 text-sm text-muted">
              Manage products and orders • {user?.email}
            </p>
          </div>
          <Link to="/" className="text-sm text-muted hover:text-text transition">
            ← Back to store
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border border-line bg-surface p-4">
            <p className="text-sm font-semibold">Dashboard</p>

            <nav className="mt-4 space-y-2 text-sm">
              <Link
                to="/admin/products"
                className="block rounded-xl border border-line bg-surface2 px-4 py-2 text-text hover:bg-surface transition"
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className="block rounded-xl border border-line bg-surface2 px-4 py-2 text-text hover:bg-surface transition"
              >
                Orders
              </Link>
              <Link
                to="/admin/categories"
                className="block rounded-xl border border-line bg-surface2 px-4 py-2 text-text hover:bg-surface transition"
                >
                 Categories
                </Link>

              <Link
                to="/admin/products/new"
                className="block rounded-xl bg-white px-4 py-2 font-semibold text-black hover:opacity-90 transition"
              >
                + Add Product
              </Link>
            </nav>
          </aside>

          <section>
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
