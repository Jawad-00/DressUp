import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { getToken } from "../lib/auth";

export default function MyOrders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/orders/my");
        if (mounted) setOrders(data);
      } catch (e) {
        alert(e?.response?.data?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Orders</h1>
            <p className="mt-1 text-sm text-muted">Track your recent purchases.</p>
          </div>
          <Link to="/shop" className="text-sm text-muted hover:text-text transition">
            Continue shopping →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-8">
            <p className="text-sm text-muted">No orders yet.</p>
            <Link
              to="/shop"
              className="mt-4 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      Order <span className="text-muted">#{o._id.slice(-6)}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Status: <span className="text-text">{o.status}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Date:{" "}
                      <span className="text-text">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-line bg-surface2 p-3">
                    <p className="text-xs text-muted">Total</p>
                    <p className="text-sm font-semibold">Rs {o.total}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {o.items.map((it, idx) => (
                    <div
                      key={`${o._id}-${idx}`}
                      className="flex gap-3 rounded-xl border border-line bg-surface2 p-3"
                    >
                      <div className="h-16 w-14 overflow-hidden rounded-lg border border-line bg-black/20">
                        {it.imageSnapshot ? (
                          <img
                            src={it.imageSnapshot}
                            alt={it.titleSnapshot}
                            className="h-full w-full object-cover"
                          />
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
    </div>
  );
}
