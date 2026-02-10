import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export default function Shop() {
  const [params, setParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state from URL
  const q = params.get("q") || "";
  const categoryId = params.get("categoryId") || "";
  const sort = params.get("sort") || "new";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.set("page", "1");
    setParams(next);
  };

  const fetchCategories = async () => {
    const { data } = await api.get("/api/categories");
    setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/products", {
        params: {
          page: 1,
          limit: 24,
          q: q || undefined,
          categoryId: categoryId || undefined,
          sort: sort || undefined,
        },
      });
      // if your backend returns {items,total,...}
      setProducts(data.items || data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoryId, sort]);

  const onSearchChange = useMemo(
    () =>
      debounce((val) => {
        setParam("q", val.trim());
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Shop</h1>
            <p className="mt-1 text-sm text-muted">
              Explore premium streetwear — built for the dark.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              defaultValue={q}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm text-text placeholder:text-muted outline-none sm:w-72"
            />

            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-text outline-none"
            >
              <option value="new">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setParam("categoryId", "")}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              categoryId
                ? "border-line bg-surface2 text-muted hover:bg-surface"
                : "border-white/15 bg-white/5 text-text",
            ].join(" ")}
          >
            All
          </button>

          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setParam("categoryId", c._id)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                categoryId === c._id
                  ? "border-white/15 bg-white/5 text-text"
                  : "border-line bg-surface2 text-muted hover:bg-surface",
              ].join(" ")}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-8">
            <p className="text-sm text-muted">No products found.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className="group rounded-2xl border border-line bg-surface p-3 hover:bg-surface2 transition"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl border border-line bg-black/20">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/20" />
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="mt-1 text-xs text-muted">{p.categoryId?.name || ""}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Rs {p.price}</p>
                    {p.compareAtPrice ? (
                      <p className="text-xs text-muted line-through">Rs {p.compareAtPrice}</p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
