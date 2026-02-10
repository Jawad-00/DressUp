import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { addToCart } from "../lib/cart";

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const sizes = useMemo(() => product?.variants || [], [product]);

  const selectedVariant = useMemo(() => {
    if (!size) return null;
    return sizes.find((v) => v.size === size) || null;
  }, [sizes, size]);

  const inStock = selectedVariant ? selectedVariant.stock : 0;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { data } = await api.get(`/api/products/${slug}`);
        if (mounted) {
          setProduct(data);
          setActiveImg(0);
          setSize(""); // reset
          setQty(1);
        }
      } catch (e) {
        if (mounted) setErr("Product not found.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const onAdd = () => {
    if (!product) return;
    if (!size) return alert("Please select a size.");

    if (qty < 1) return;
    if (qty > inStock) return alert("Not enough stock for this size.");

    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
      size,
      qty,
    });

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="px-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Loading product…
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="px-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="text-sm text-muted">{err}</p>
            <Link to="/shop" className="mt-4 inline-block text-sm text-text underline">
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [""];

  return (
    <div className="px-4">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-muted">
          <Link className="hover:text-text transition" to="/shop">
            Shop
          </Link>{" "}
          <span className="opacity-60">/</span>{" "}
          <span className="text-text">{product.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gallery */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="aspect-[4/5] overflow-hidden rounded-xl border border-line bg-black/20">
              {images[activeImg] ? (
                <img
                  src={images[activeImg]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/20" />
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={[
                    "h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition",
                    i === activeImg ? "border-white/20" : "border-line hover:border-white/15",
                  ].join(" ")}
                >
                  {src ? (
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-b from-white/10 to-black/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p className="mt-2 text-sm text-muted">
                  {product.categoryId?.name ? product.categoryId.name : "DressUp"}
                </p>
              </div>

              {product.isFeatured ? (
                <span className="rounded-full border border-line bg-surface2 px-3 py-1 text-xs text-muted">
                  Featured
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-xl font-semibold">Rs {product.price}</p>

            {product.description ? (
              <p className="mt-4 text-sm text-muted leading-relaxed">{product.description}</p>
            ) : null}

            {/* Sizes */}
            <div className="mt-6">
              <p className="text-sm font-semibold">Select Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((v) => {
                  const disabled = v.stock <= 0;
                  const active = size === v.size;
                  return (
                    <button
                      key={v.size}
                      disabled={disabled}
                      onClick={() => setSize(v.size)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition",
                        disabled
                          ? "border-line bg-surface2 text-muted opacity-50 cursor-not-allowed"
                          : active
                          ? "border-white/20 bg-white text-black"
                          : "border-line bg-surface2 text-text hover:bg-surface",
                      ].join(" ")}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>

              {size ? (
                <p className="mt-3 text-sm text-muted">
                  Stock: <span className="text-text">{inStock}</span>
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted">Choose a size to see stock.</p>
              )}
            </div>

            {/* Qty */}
            <div className="mt-6">
              <p className="text-sm font-semibold">Quantity</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface2 px-2 py-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-9 w-9 rounded-full border border-line bg-surface text-text hover:bg-surface2 transition"
                >
                  −
                </button>
                <div className="w-10 text-center text-sm font-semibold">{qty}</div>
                <button
                  onClick={() => {
                    const max = size ? inStock : 99;
                    setQty((q) => Math.min(max, q + 1));
                  }}
                  className="h-9 w-9 rounded-full border border-line bg-surface text-text hover:bg-surface2 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onAdd}
                className="flex-1 rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition"
              >
                Add to cart
              </button>
              <Link
                to="/cart"
                className="rounded-full border border-line bg-surface2 px-5 py-3 text-sm font-semibold text-text hover:bg-surface transition"
              >
                View cart
              </Link>
            </div>

            {/* Policies */}
            <div className="mt-6 rounded-2xl border border-line bg-surface2 p-4 text-sm text-muted">
              <p className="text-text font-semibold">Delivery & Returns</p>
              <ul className="mt-2 space-y-1">
                <li>• Dispatch in 48–72 hours</li>
                <li>• 7-day return policy</li>
                <li>• No payment gateway (COD/Manual order for now)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link to="/shop" className="text-sm text-muted hover:text-text transition">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
