import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";

const SIZES = ["S", "M", "L", "XL"];

export default function AdminProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    tags: "",
    isFeatured: false,
    isActive: true,
    images: [],
    variants: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
  });

  const canSave = useMemo(() => {
    if (!form.title.trim()) return false;
    if (!form.slug.trim()) return false;
    if (!form.categoryId) return false;
    if (String(form.price).trim() === "") return false;
    return true;
  }, [form]);

  const autoSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const fetchCategories = async () => {
    const { data } = await api.get("/api/categories/admin/all");
    setCategories(data);
  };

  const fetchProduct = async () => {
    if (mode !== "edit") return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/products/id/${id}`);
      setForm((f) => ({
        ...f,
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        price: data.price ?? "",
        compareAtPrice: data.compareAtPrice ?? "",
        categoryId: data.categoryId?._id || data.categoryId || "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
        isFeatured: !!data.isFeatured,
        isActive: data.isActive !== false,
        images: data.images || [],
        variants:
          data.variants?.length
            ? data.variants.map((v) => ({ size: v.size, stock: v.stock }))
            : f.variants,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const onUpload = async (files) => {
    if (!files || files.length === 0) return;

    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append("images", file));

    setUploading(true);
    try {
      const { data } = await api.post("/api/upload/multiple", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // data.images = [{url, public_id}]
      const urls = data.images.map((x) => x.url);
      setForm((f) => ({ ...f, images: [...(f.images || []), ...urls] }));
    } catch (e) {
      alert(e?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setForm((f) => ({ ...f, images: (f.images || []).filter((x) => x !== url) }));
  };

  const onSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : 0,
        categoryId: form.categoryId,
        images: form.images || [],
        variants: (form.variants || []).map((v) => ({
          size: v.size,
          stock: Number(v.stock),
        })),
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        isFeatured: !!form.isFeatured,
        isActive: !!form.isActive,
      };

      if (mode === "create") {
        await api.post("/api/products", payload);
      } else {
        await api.patch(`/api/products/${id}`, payload);
      }

      navigate("/admin/products");
    } catch (e) {
      alert(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </p>
          <p className="mt-1 text-sm text-muted">Upload images, set price, manage sizes.</p>
        </div>
        <Link to="/admin/products" className="text-sm text-muted hover:text-text transition">
          ← Back
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main form */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Basic</p>

            <div className="mt-3 grid gap-3">
              <input
                value={form.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title: val,
                    slug: f.slug ? f.slug : autoSlug(val),
                  }));
                }}
                placeholder="Title"
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
              />

              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: autoSlug(e.target.value) }))}
                placeholder="Slug"
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
              />

              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                className="h-28 w-full rounded-xl border border-line bg-bg p-3 text-sm text-text placeholder:text-muted outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Pricing & Category</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="Price (e.g. 4500)"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
              />
              <input
                value={form.compareAtPrice}
                onChange={(e) => setForm((f) => ({ ...f, compareAtPrice: e.target.value }))}
                placeholder="Compare at (optional)"
                className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
              />

              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="sm:col-span-2 rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text outline-none"
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.isActive ? "" : "(inactive)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Inventory (Sizes)</p>

            <div className="mt-3 grid gap-2">
              {SIZES.map((s) => {
                const v = form.variants.find((x) => x.size === s) || { size: s, stock: 0 };
                return (
                  <div
                    key={s}
                    className="flex items-center justify-between rounded-xl border border-line bg-bg px-3 py-2"
                  >
                    <p className="text-sm font-semibold">{s}</p>
                    <input
                      value={v.stock}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm((f) => ({
                          ...f,
                          variants: f.variants.map((x) =>
                            x.size === s ? { ...x, stock: val } : x
                          ),
                        }));
                      }}
                      className="w-24 rounded-lg border border-line bg-surface px-3 py-1 text-sm text-text outline-none text-right"
                      placeholder="0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Side panel */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Images</p>
            <p className="mt-1 text-xs text-muted">Upload up to 6 at once.</p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onUpload(e.target.files)}
              className="mt-3 block w-full text-sm text-muted"
            />

            {uploading ? <p className="mt-3 text-xs text-muted">Uploading…</p> : null}

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(form.images || []).map((url) => (
                <div key={url} className="relative">
                  <div className="aspect-[4/5] overflow-hidden rounded-lg border border-line bg-black/20">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <button
                    onClick={() => removeImage(url)}
                    className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-black"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Tags</p>
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. hoodie, new, streetwear"
              className="mt-3 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
            />
            <p className="mt-2 text-xs text-muted">Comma separated.</p>
          </div>

          <div className="rounded-2xl border border-line bg-surface2 p-4">
            <p className="text-sm font-semibold">Visibility</p>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-bg px-3 py-2">
              <p className="text-sm text-muted">Featured</p>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              />
            </div>

            <div className="mt-2 flex items-center justify-between rounded-xl border border-line bg-bg px-3 py-2">
              <p className="text-sm text-muted">Active</p>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
            </div>
          </div>

          <button
            disabled={!canSave || saving}
            onClick={onSave}
            className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
          </button>
        </aside>
      </div>
    </div>
  );
}
