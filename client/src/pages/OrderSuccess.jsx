import { Link, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const id = params.get("id");

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-line bg-surface p-8">
          <p className="text-sm font-semibold">Order Placed ✅</p>
          <p className="mt-2 text-sm text-muted">Your order has been created successfully.</p>

          {id ? (
            <p className="mt-3 text-sm text-muted">
              Order ID: <span className="text-text">{id}</span>
            </p>
          ) : null}

          <div className="mt-6 flex gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="rounded-full border border-line bg-surface2 px-6 py-3 text-sm font-semibold text-text hover:bg-surface transition"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
