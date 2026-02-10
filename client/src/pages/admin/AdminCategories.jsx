import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // null => create mode, otherwise edit mode for that id
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
  });

  const isEdit = !!editingId;

  const autoSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const canSave = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.slug.trim()) return false;
    return true;
  }, [form.name, form.slug]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/categories/admin/all");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", image: "" });
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      image: cat.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Upload image using your existing upload endpoint
  const onUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const fd = new FormData();
    // IMPORTANT: match the field name your backend expects
    // In your product upload, you used "images". We'll reuse the same.
    fd.append("images", file);

    setUploading(true);
    try {
      const { data } = await api.post("/api/upload/multiple", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // data.images = [{ url, public_id }]
      const url = data?.images?.[0]?.url;
      if (!url) return alert("Upload succeeded but no URL returned.");

      setForm((f) => ({ ...f, image: url }));
    } catch (e) {
      alert(e?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: autoSlug(form.slug),
        image: form.image || "",
      };

      if (!isEdit) {
        // CREATE
        await api.post("/api/categories", payload);
      } else {
        // UPDATE
        await api.patch(`/api/categories/${editingId}`, payload);
      }

      await fetchAll();
      resetForm();
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        (Array.isArray(e2?.response?.data?.errors) ? "Validation error" : null) ||
        "Save failed";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const onToggleActive = async (id, isActive) => {
    try {
      await api.patch(`/api/categories/${id}/active`, { isActive: !isActive });
      await fetchAll();
    } catch (e) {
      alert(e?.response?.data?.message || "Update active failed");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this category? (soft delete)")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      await fetchAll();
      // if you deleted the one you were editing, reset form
      if (editingId === id) resetForm();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Categories</p>
          <p className="mt-1 text-sm text-muted">
            Create, edit, activate, and remove categories.
          </p>
        </div>

        {isEdit ? (
          <button
            onClick={resetForm}
            className="rounded-full border border-line bg-surface2 px-4 py-2 text-sm font-semibold text-text hover:bg-surface transition"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      {/* ✅ CREATE / EDIT FORM */}
      <form onSubmit={onSave} className="mt-5 rounded-2xl border border-line bg-surface2 p-4">
        <p className="text-sm font-semibold">{isEdit ? "Edit Category" : "Add Category"}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) => {
              const val = e.target.value;
              setForm((f) => ({
                ...f,
                name: val,
                slug: f.slug ? f.slug : autoSlug(val),
              }));
            }}
            placeholder="Name (e.g. Hoodies)"
            className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
          />

          <input
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: autoSlug(e.target.value) }))}
            placeholder="Slug (e.g. hoodies)"
            className="rounded-xl border border-line bg-bg px-3 py-2 text-sm text-text placeholder:text-muted outline-none"
          />

          {/* ✅ Upload image */}
          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUpload(e.target.files)}
                className="block text-sm text-muted"
              />

              {uploading ? (
                <span className="text-xs text-muted">Uploading…</span>
              ) : form.image ? (
                <span className="text-xs text-muted">Image selected ✅</span>
              ) : (
                <span className="text-xs text-muted">No image (optional)</span>
              )}
            </div>

            {form.image ? (
              <div className="mt-3 h-24 overflow-hidden rounded-xl border border-line bg-black/20">
                <img src={form.image} alt="Category" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSave || saving || uploading}
          className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-60"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
        </button>
      </form>

      {/* ✅ LIST */}
      <div className="mt-5">
        {loading ? (
          <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
            No categories yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {items.map((c) => (
              <div key={c._id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="mt-1 text-xs text-muted">/{c.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="rounded-full border border-line bg-surface2 px-4 py-2 text-xs text-text hover:bg-surface transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleActive(c._id, c.isActive)}
                      className="rounded-full border border-line bg-surface2 px-4 py-2 text-xs text-text hover:bg-surface transition"
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(c._id)}
                      className="rounded-full border border-line bg-surface2 px-4 py-2 text-xs text-muted hover:text-text hover:bg-surface transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {c.image ? (
                  <div className="mt-3 h-20 overflow-hidden rounded-xl border border-line bg-black/20">
                    <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
