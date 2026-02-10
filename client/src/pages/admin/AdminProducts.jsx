import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });

  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState(""); // "", "true", "false"

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 20, sort: "new" };
      if (q.trim()) params.q = q.trim();
      if (isActive !== "") params.isActive = isActive;

      const res = await api.get("/api/products/admin/all", { params });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActive = async (id, next) => {
    await api.patch(`/api/products/${id}/active`, { isActive: next });
    fetchList();
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">Products</p>
          <p className="mt-1 text-sm text-muted">Search and manage inventory.</p>
        </div>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="rounded-full border border-line bg-bg px-4 py-2 text-sm text-text placeholder:text-muted outline-none"
          />
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="rounded-full border border-line bg-bg px-4 py-2 text-sm text-text outline-none"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button
            onClick={fetchList}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-5 text-sm text-muted">Loading…</div>
      ) : (
        <div className="mt-5 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((p) => (
                <tr key={p._id} className="border-t border-line">
                  <td className="py-3">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-muted">{p.slug}</p>
                  </td>
                  <td className="py-3 text-muted">{p.categoryId?.name || "—"}</td>
                  <td className="py-3">Rs {p.price}</td>
                  <td className="py-3">
                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-xs",
                        p.isActive
                          ? "border-white/15 bg-white/5 text-text"
                          : "border-line bg-surface2 text-muted",
                      ].join(" ")}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="rounded-full border border-line bg-surface2 px-4 py-2 text-xs text-text hover:bg-surface transition"
                      >
                        Edit
                      </Link>
                      {p.isActive ? (
                        <button
                          onClick={() => toggleActive(p._id, false)}
                          className="rounded-full border border-line bg-surface2 px-4 py-2 text-xs text-text hover:bg-surface transition"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(p._id, true)}
                          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:opacity-90 transition"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-xs text-muted">Total: {data.total}</p>
        </div>
      )}
    </div>
  );
}
