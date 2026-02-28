import { useState, useEffect } from "react";
import { X, Save, MapPin, Tag, FileText, Image, ToggleLeft } from "lucide-react";

const CATEGORIES = [
  "Electronics", "Accessories", "Bags", "Documents",
  "Keys", "Drinkware", "Stationery", "Clothing", "Other",
];

const ZONES = [
  "Library", "Science Faculty", "Engineering", "Cafeteria",
  "Auditorium", "Student Union", "Sports Complex", "Administration", "Other",
];

const STATUS_OPTIONS = [
  { value: "lost",    label: "Lost",    color: "bg-red-100 text-red-700 border-red-200" },
  { value: "found",   label: "Found",   color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "claimed", label: "Claimed", color: "bg-slate-100 text-slate-600 border-slate-200" },
];

/**
 * UpdatePostModal
 * Props:
 *   post      – the post object to edit
 *   onSave    – called with updated post data: onSave(id, updatedFields)
 *   onCancel  – called when user cancels / closes
 */
export default function UpdatePostModal({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    zone: "",
    description: "",
    status: "lost",
  });

  // Populate form when post changes
  useEffect(() => {
    if (post) {
      setForm({
        title:       post.title       || "",
        category:    post.category    || "",
        location:    post.location    || "",
        zone:        post.zone        || "",
        description: post.description || "",
        status:      post.status      || "lost",
      });
    }
  }, [post]);

  if (!post) return null;

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.location.trim()) return;
    onSave(post.id, form);
  };

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* ── Modal ── */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Update Post</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{post.id}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Image preview */}
          {post.img && (
            <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100">
              <img
                src={post.img}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-white text-xs">
                <Image size={12} />
                <span>Current photo</span>
              </div>
            </div>
          )}

          {/* ── Status selector ── */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              <ToggleLeft size={13} /> Status
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleChange("status", value)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.status === value
                      ? `${color} shadow-sm scale-[1.02]`
                      : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Title ── */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              <Tag size={13} /> Item Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Blue Hydro Flask"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-300"
            />
          </div>

          {/* ── Category + Zone ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-600 appearance-none cursor-pointer"
              >
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5 block">
                Campus Zone
              </label>
              <select
                value={form.zone}
                onChange={(e) => handleChange("zone", e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-600 appearance-none cursor-pointer"
              >
                <option value="">Select…</option>
                {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
          </div>

          {/* ── Location ── */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              <MapPin size={13} /> Exact Location <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. Library – Floor 2, Table near window"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-300"
            />
          </div>

          {/* ── Description ── */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              <FileText size={13} /> Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the item — color, brand, unique marks…"
              rows={3}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-300 resize-none"
            />
          </div>

          {/* ── User info (read-only) ── */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Posted by</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {post.user?.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{post.user?.name}</p>
                <p className="text-xs text-slate-400">{post.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-white">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.location.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-violet-200"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}