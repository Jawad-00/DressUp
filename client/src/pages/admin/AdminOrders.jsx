import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const STATUSES = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Orders</p>
          <p className="mt-1 text-sm text-muted">Manage and update order status.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="rounded-full border border-line bg-surface2 px-5 py-2 text-sm text-text hover:bg-surface transition"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="mt-5 text-sm text-muted">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="mt-5 text-sm text-muted">No orders yet.</div>
      ) : (
        <div className="mt-5 space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-2xl border border-line bg-surface2 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Order <span className="text-muted">#{o._id.slice(-6)}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Customer: <span className="text-text">{o.userId?.email || "—"}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Total: <span className="text-text">Rs {o.total}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Date: <span className="text-text">{new Date(o.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-bg p-3">
                  <p className="text-xs text-muted">Status</p>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {o.items.map((it, idx) => (
                  <div
                    key={`${o._id}-${idx}`}
                    className="flex gap-3 rounded-xl border border-line bg-bg p-3"
                  >
                    <div className="h-16 w-14 overflow-hidden rounded-lg border border-line bg-black/20">
                      {it.imageSnapshot ? (
                        <img src={it.imageSnapshot} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/20" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{it.titleSnapshot}</p>
                      <p className="mt-1 text-xs text-muted">
                        Size {it.size} • Qty {it.qty}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Rs {it.priceSnapshot * it.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-muted">
                <p className="text-text font-semibold">Shipping</p>
                <p className="mt-1">
                  {o.shippingAddress?.fullName} • {o.shippingAddress?.phone}
                </p>
                <p className="mt-1">
                  {o.shippingAddress?.address}, {o.shippingAddress?.city},{" "}
                  {o.shippingAddress?.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
