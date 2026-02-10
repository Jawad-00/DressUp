import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart, updateQty } from "../lib/cart";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, x) => sum + x.price * x.qty, 0);
  }, [items]);

  const onRemove = (productId, size) => {
    const updated = removeFromCart(productId, size);
    setItems(updated);
  };

  const onQty = (productId, size, qty) => {
    if (qty < 1) return;
    const updated = updateQty(productId, size, qty);
    setItems(updated);
  };

  const empty = items.length === 0;

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Cart</h1>
            <p className="mt-1 text-sm text-muted">Review items before checkout.</p>
          </div>
          <Link to="/shop" className="text-sm text-muted hover:text-text transition">
            Continue shopping →
          </Link>
        </div>

        {empty ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-8">
            <p className="text-sm text-muted">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-4 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <section className="space-y-4">
              {items.map((x) => (
                <div
                  key={`${x.productId}-${x.size}`}
                  className="rounded-2xl border border-line bg-surface p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-28 w-24 overflow-hidden rounded-xl border border-line bg-black/20">
                      {x.image ? (
                        <img src={x.image} alt={x.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/20" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{x.title}</p>
                          <p className="mt-1 text-sm text-muted">Size: {x.size}</p>
                        </div>
                        <button
                          onClick={() => onRemove(x.productId, x.size)}
                          className="rounded-full border border-line bg-surface2 px-4 py-2 text-sm text-text hover:bg-surface transition"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        {/* Qty */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface2 px-2 py-2">
                          <button
                            onClick={() => onQty(x.productId, x.size, x.qty - 1)}
                            className="h-9 w-9 rounded-full border border-line bg-surface text-text hover:bg-surface2 transition"
                          >
                            −
                          </button>
                          <div className="w-10 text-center text-sm font-semibold">{x.qty}</div>
                          <button
                            onClick={() => onQty(x.productId, x.size, x.qty + 1)}
                            className="h-9 w-9 rounded-full border border-line bg-surface text-text hover:bg-surface2 transition"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-semibold">Rs {x.price * x.qty}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
              <p className="text-sm font-semibold">Order Summary</p>

              <div className="mt-4 space-y-2 text-sm">
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
                onClick={() => navigate("/checkout")}
                className="mt-5 w-full rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition"
              >
                Checkout
              </button>

              <p className="mt-3 text-xs text-muted">
                No payment gateway yet — order will be placed without payment.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
