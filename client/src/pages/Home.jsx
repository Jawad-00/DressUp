import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Home() {
  const [dbCategories, setDbCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    // Featured products
    (async () => {
      try {
        const { data } = await api.get("/api/products/featured", { params: { limit: 6 } });
        setFeaturedItems(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingFeatured(false);
      }
    })();

    // Categories from DB
    (async () => {
      try {
        const { data } = await api.get("/api/categories");
        setDbCategories(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  // Helpers to support different backend field names
  const getTitle = (p) => p?.title || p?.name || "Untitled Product";
  const getImage = (p) => {
    if (Array.isArray(p?.images) && p.images.length) return p.images[0];
    if (typeof p?.image === "string") return p.image;
    return "";
  };
  const getPrice = (p) => {
    const val = p?.price ?? p?.salePrice ?? "";
    if (val === "" || val === null || val === undefined) return "—";
    return `Rs ${val}`;
  };

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <section className="relative mt-4 overflow-hidden rounded-[2.25rem] border border-line bg-surface shadow-glow">
          {/* Background gradients */}
          <div className="absolute inset-0">
            <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/30" />
          </div>

          <div className="relative grid gap-10 px-6 py-14 md:grid-cols-2 md:items-center md:px-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-muted backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-accent" />
                New Season Drop • DressUp
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Dark fits. Clean silhouettes.
                <span className="text-muted"> Built for everyday streetwear.</span>
              </h1>

              <p className="mt-4 max-w-xl text-muted">
                Explore premium essentials, oversized hoodies, and minimal tees crafted for comfort
                and style.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
                >
                  Shop New Drop
                </Link>

                <a
                  href="#categories"
                  className="rounded-full border border-white/10 bg-black/20 px-6 py-3 text-sm font-semibold text-text backdrop-blur hover:bg-black/30 transition"
                >
                  Explore Categories
                </a>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-muted sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                  <p className="text-text font-semibold">Premium Quality</p>
                  <p className="mt-1 text-muted">Heavyweight fabrics</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                  <p className="text-text font-semibold">Fast Dispatch</p>
                  <p className="mt-1 text-muted">48–72 hours</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                  <p className="text-text font-semibold">Easy Returns</p>
                  <p className="mt-1 text-muted">7-day policy</p>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-5 backdrop-blur">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                <div className="relative">
                  <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/30">
                    {/* Optional image slot (no logic needed) */}
                    <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.10),transparent_45%)]" />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Drop 01</p>
                      <p className="mt-1 text-xs text-muted">Oversized • Minimal • Bold</p>
                    </div>
                    <Link
                      to="/shop"
                      className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-text backdrop-blur hover:bg-black/30 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-muted backdrop-blur">
                ★ 4.8 rating • Loved by streetwear fans
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-white/10" />

        {/* CATEGORIES */}
        <section id="categories" className="mt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Shop by Category</h2>
              <p className="mt-1 text-sm text-muted">Find your fit in seconds.</p>
            </div>
            <Link
              to="/shop"
              className="rounded-full border border-line bg-surface2 px-4 py-2 text-sm text-text hover:bg-surface transition"
            >
              View all →
            </Link>
          </div>

          {loadingCats ? (
            <div className="mt-6 rounded-3xl border border-line bg-surface p-8 text-sm text-muted">
              Loading categories…
            </div>
          ) : dbCategories.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-line bg-surface p-8 text-sm text-muted">
              No categories yet. Add categories from Admin.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dbCategories.slice(0, 6).map((c) => (
                <Link
                  key={c._id || c.slug}
                  to={`/shop?category=${encodeURIComponent(c.slug)}`}
                  className="group relative overflow-hidden rounded-3xl border border-line bg-surface transition hover:bg-surface2 hover:shadow-glow"
                >
                  {/* Image */}
                  <div className="relative h-60 w-full">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-white/10 to-black/25" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      Browse
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-lg font-semibold tracking-tight">{c.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {c.desc || "Explore fresh drops & essentials"}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                      Explore <span className="transition group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* Glow */}
                  <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent/10 blur-3xl opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-white/10" />

        {/* FEATURED */}
        <section className="mt-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Featured Picks</h2>
              <p className="mt-1 text-sm text-muted">Handpicked essentials from the latest drop.</p>
            </div>
            <Link
              to="/shop?featured=true"
              className="rounded-full border border-line bg-surface2 px-4 py-2 text-sm text-text hover:bg-surface transition"
            >
              Shop →
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="mt-6 rounded-3xl border border-line bg-surface p-8 text-sm text-muted">
              Loading featured…
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-line bg-surface p-8 text-sm text-muted">
              No featured products yet. Mark products as featured in Admin.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredItems.slice(0, 4).map((p) => {
                const title = getTitle(p);
                const img = getImage(p);
                const price = getPrice(p);

                return (
                  <Link
                    key={p._id || p.id || title}
                    to={`/product/${p.slug}`}
                    className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-4 transition hover:bg-surface2 hover:shadow-glow"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      {img ? (
                        <img
                          src={img}
                          alt={title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/30" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        Featured
                      </div>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{title}</p>
                        <p className="mt-1 text-sm text-muted">{price}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-line bg-surface2 px-3 py-1 text-[11px] text-muted">
                        Drop
                      </span>
                    </div>

                    <div className="mt-4 w-full rounded-full bg-white py-2 text-center text-sm font-semibold text-black hover:opacity-90 transition">
                      View Product
                    </div>

                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-0 transition group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* COMMUNITY */}
        <section className="relative mt-14 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-8">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/25" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">Join the DressUp community</p>
              <p className="mt-1 text-sm text-muted">
                Minimal streetwear. Premium quality. Built for daily wear.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-full border border-line bg-surface2 px-5 py-2 text-sm text-text hover:bg-surface transition">
                Instagram
              </button>
              <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90 transition">
                Newsletter
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 mb-10 border-t border-line pt-8 text-sm text-muted">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} DressUp. All rights reserved.</p>
            <div className="flex gap-5">
              <a className="hover:text-text transition" href="#">
                Privacy
              </a>
              <a className="hover:text-text transition" href="#">
                Returns
              </a>
              <a className="hover:text-text transition" href="#">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
