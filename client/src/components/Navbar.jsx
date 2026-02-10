import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../lib/cart";
import { clearAuth, getUser, isAdmin  } from "../lib/auth";

export default function Navbar() {
const [admin, setAdmin] = useState(isAdmin());
const navigate = useNavigate();

useEffect(() => {
  const sync = () => setAdmin(isAdmin());
  sync();
  window.addEventListener("dressup_auth_changed", sync);
  return () => window.removeEventListener("dressup_auth_changed", sync);
}, []);
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(getUser());

  const computeCount = () => {
    const cart = getCart();
    const c = cart.reduce((sum, x) => sum + x.qty, 0);
    setCount(c);
  };
  

  useEffect(() => {
    computeCount();

    const onCart = () => computeCount();
    window.addEventListener("dressup_cart_changed", onCart);

    // optional: update user state when auth changes
    const onAuth = () => setUser(getUser());
    window.addEventListener("dressup_auth_changed", onAuth);

    return () => {
      window.removeEventListener("dressup_cart_changed", onCart);
      window.removeEventListener("dressup_auth_changed", onAuth);
    };
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    window.dispatchEvent(new Event("dressup_auth_changed"));
    navigate("/");
  };

  return (
    <header className="fixed left-0 right-0 top-4 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between rounded-full border border-line bg-surface/90 px-3 shadow-glow backdrop-blur">
          {/* Left: Logo circle */}
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface2"
          >
            <span className="text-sm font-semibold">D</span>
          </Link>
          {admin ? (
            <button
                onClick={() => navigate("/admin/products/new")}
                className="rounded-full border border-line bg-surface2 px-4 py-2 text-sm font-semibold text-text hover:bg-surface transition"
            >
                Products Detail
            </button>
            ) : null}


          {/* Center: Links */}
         <nav className="hidden gap-6 text-sm text-muted md:flex">
         <Link className="hover:text-text transition" to="/shop">Shop</Link>
          <a className="hover:text-text transition" href="/#categories">Categories</a>
         <Link className="hover:text-text transition" to="/shop?featured=true">New</Link>
           {user ? (
        <Link className="hover:text-text transition" to="/my-orders">
           Orders
        </Link>
        
          ) : null}
         </nav>


          {/* Right: Pill */}
          <div className="flex items-center gap-2">
            {/* Cart pill */}
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-full border border-line bg-surface2 px-4 py-2 text-sm text-muted hover:text-text transition"
            >
              <span className="text-text">Cart</span>
              <span className="h-1 w-1 rounded-full bg-muted/40" />
              <span className="text-text">({count})</span>
            </Link>

            {/* Auth pill */}
            {!user ? (
              <Link
                to="/login"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="rounded-full border border-line bg-surface2 px-5 py-2 text-sm font-semibold text-text hover:bg-surface transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
