import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { clearCart, getCart } from "../lib/cart";
import { getToken } from "../lib/auth";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    const cart = getCart();
    setItems(cart);

    // ✅ if user is not logged in, redirect to login and come back here
    if (!getToken()) {
      navigate("/login", { state: { from: "/checkout" }, replace: true });
    }
  }, [navigate]);

  const subtotal = useMemo(() => items.reduce((sum, x) => sum + x.price * x.qty, 0), [items]);
  const empty = items.length === 0;

  const onPlaceOrder = async () => {
    if (empty) return;

    // ✅ guard (in case token got removed while user is on checkout)
    if (!getToken()) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
      return;
    }

    // Basic validation
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.country) {
      return alert("Please fill all shipping fields.");
    }

    setPlacing(true);
    try {
      const payload = {
        items: items.map((x) => ({
          productId: x.productId,
          titleSnapshot: x.title,
          priceSnapshot: x.price,
          imageSnapshot: x.image || "",
          size: x.size,
          qty: x.qty,
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          country: form.country,
        },
      };

      // ✅ No token needed here. Interceptor sends it automatically.
      const { data } = await api.post("/api/orders", payload);

      clearCart();
      navigate(`/order-success?id=${data._id}`);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (empty) {
    return (
      <div className="px-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-line bg-surface p-8">
            <p className="text-sm text-muted">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-4 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <p className="mt-1 text-sm text-muted">Enter shipping details and place order.</p>
          </div>
          <Link to="/cart" className="text-sm text-muted hover:text-text transition">
            ← Back to cart
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <section className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm font-semibold">Shipping Address</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Full name"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
              />
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
              />
              <input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="Country"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
              />
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Full address"
                className="sm:col-span-2 rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm font-semibold">Order Summary</p>

            <div className="mt-4 space-y-2 text-sm">
              {items.map((x) => (
                <div
                  key={`${x.productId}-${x.size}`}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="text-muted">
                    <p className="text-text text-sm font-semibold">{x.title}</p>
                    <p className="text-xs text-muted">
                      Size {x.size} • Qty {x.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">Rs {x.price * x.qty}</p>
                </div>
              ))}

              <div className="my-3 h-px bg-white/10" />

              <div className="flex items-center justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-text">Rs {subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Shipping</span>
                <span className="text-text">Rs 0</span>
              </div>

              <div className="my-3 h-px bg-white/10" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-semibold">Rs {subtotal}</span>
              </div>
            </div>

            <button
              onClick={onPlaceOrder}
              disabled={placing}
              className="mt-5 w-full rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
            >
              {placing ? "Placing…" : "Place Order"}
            </button>

            <p className="mt-3 text-xs text-muted">
              No payment gateway — order will be created in database.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
