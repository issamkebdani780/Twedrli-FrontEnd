import { useState } from "react";
import {
  Search, Filter, LayoutGrid, List, MapPin,
  Clock, Trash2, Pencil, ChevronLeft, ChevronRight,
} from "lucide-react";

import DeleteConfirmModal from "./componenet/Deleteconfirmmodal";
import UpdatePostModal    from "./componenet/Updatepostmodal";

const INITIAL_POSTS = [
  { id: "P-1041", title: "Blue Hydro Flask",      category: "Drinkware",   status: "lost",    location: "Zone Chimie – Lab 2",        zone: "Science Faculty", date: "2h ago",  user: { name: "Amir Meziane",   avatar: "AM", email: "a.meziane@uabb.dz"  }, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=80", description: "Blue 32oz Hydro Flask with a dent on the side, left near the sink." },
  { id: "P-1040", title: "TI-84 Calculator",      category: "Electronics", status: "found",   location: "Main Library – 3rd Floor",   zone: "Library",         date: "6h ago",  user: { name: "Karima Bouzid",  avatar: "KB", email: "k.bouzid@uabb.dz"   }, img: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=300&q=80", description: "Found a graphing calculator on one of the study tables." },
  { id: "P-1039", title: "Car Keys & Keychain",   category: "Keys",        status: "claimed", location: "Student Union Cafe",          zone: "Student Union",   date: "1d ago",  user: { name: "Yacine Benaissa",avatar: "YB", email: "y.benaissa@uabb.dz" }, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", description: "Toyota key with a black leather keychain and two small keys." },
  { id: "P-1038", title: "Black Laptop Bag",      category: "Bags",        status: "found",   location: "Auditorium – Main Hall",      zone: "Auditorium",      date: "1d ago",  user: { name: "Sara Rahmani",   avatar: "SR", email: "s.rahmani@uabb.dz"  }, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80", description: "Large black laptop bag, Dell brand sticker. Found after lecture." },
  { id: "P-1037", title: "Glasses – Black Frame", category: "Accessories", status: "lost",    location: "Room 204 – Eng. Dept.",       zone: "Engineering",     date: "2d ago",  user: { name: "Fateh Hamidi",   avatar: "FH", email: "f.hamidi@uabb.dz"   }, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&q=80", description: "Prescription glasses with black rectangular frames." },
  { id: "P-1036", title: "Student ID – Blue",     category: "Documents",   status: "found",   location: "Cafeteria – Building B",      zone: "Cafeteria",       date: "3d ago",  user: { name: "Leila Cherif",   avatar: "LC", email: "l.cherif@uabb.dz"   }, img: "https://images.unsplash.com/photo-1586892478025-2b5472316994?w=300&q=80", description: "University ID card found near the payment counter." },
  { id: "P-1035", title: "Sony Headphones",       category: "Electronics", status: "lost",    location: "Main Library – Floor 1",      zone: "Library",         date: "3d ago",  user: { name: "Riad Ouali",     avatar: "RO", email: "r.ouali@uabb.dz"    }, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80", description: "Over-ear Sony WH-1000XM4, black. Lost near study pods." },
  { id: "P-1034", title: "Physics Notebook",      category: "Stationery",  status: "found",   location: "Science Hall – Room 12",      zone: "Science Faculty", date: "4d ago",  user: { name: "Nadia Salhi",    avatar: "NS", email: "n.salhi@uabb.dz"    }, img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80", description: "Green notebook filled with physics equations." },
  { id: "P-1033", title: "AirPods Pro Case",      category: "Electronics", status: "claimed", location: "Student Union – 2nd Floor",   zone: "Student Union",   date: "5d ago",  user: { name: "Mourad Kaci",    avatar: "MK", email: "m.kaci@uabb.dz"     }, img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=300&q=80", description: "White AirPods Pro charging case, no earbuds inside." },
];

const STATUS_FILTERS = ["All", "Lost", "Found", "Claimed"];
const PAGE_SIZE = 6;

const statusStyle = {
  lost:    "bg-red-100 text-red-700 border border-red-200",
  found:   "bg-emerald-100 text-emerald-700 border border-emerald-200",
  claimed: "bg-slate-100 text-slate-600 border border-slate-200",
};

const avatarColors = [
  "from-violet-400 to-indigo-500", "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",  "from-teal-400 to-emerald-500",
  "from-sky-400 to-blue-500",
];
const avatarColor = (s) => avatarColors[s.charCodeAt(0) % avatarColors.length];

function PostCard({ post, onUpdate, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <img src={post.img} alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.style.display = "none"; }} />
        <div className="absolute top-2.5 left-2.5">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${statusStyle[post.status]}`}>
            {post.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{post.title}</h3>
          <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 mt-0.5 flex-shrink-0">
            <Clock size={10} /> {post.date}
          </span>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">{post.category}</span>
        <p className="text-xs text-slate-400 mt-2 flex items-start gap-1">
          <MapPin size={11} className="mt-0.5 flex-shrink-0 text-violet-400" /> {post.location}
        </p>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{post.description}</p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor(post.user.avatar)} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
            {post.user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">{post.user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{post.user.email}</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{post.id}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => onUpdate(post)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-semibold border border-violet-100">
            <Pencil size={12} /> Update
          </button>
          <button onClick={() => onDelete(post)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold border border-red-100">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function PostRow({ post, onUpdate, onDelete }) {
  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            <img src={post.img} alt={post.title} className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <div>
            <p className="font-medium text-slate-700 text-sm">{post.title}</p>
            <p className="text-[10px] text-slate-400 font-mono">{post.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{post.category}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={10} className="text-violet-400 flex-shrink-0" />{post.location}</span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor(post.user.avatar)} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
            {post.user.avatar}
          </div>
          <span className="text-xs text-slate-600">{post.user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
        <span className="flex items-center gap-1"><Clock size={10} />{post.date}</span>
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusStyle[post.status]}`}>
          {post.status}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onUpdate(post)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-semibold border border-violet-100">
            <Pencil size={12} /> Update
          </button>
          <button onClick={() => onDelete(post)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold border border-red-100">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ManagePosts() {
  const [posts, setPosts]                 = useState(INITIAL_POSTS);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [viewMode, setViewMode]           = useState("grid");
  const [page, setPage]                   = useState(1);
  const [updateTarget, setUpdateTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(q)    ||
      p.location.toLowerCase().includes(q) ||
      p.user.name.toLowerCase().includes(q)||
      p.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || p.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  const handleUpdate = (id, fields) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, ...fields } : p));
    setUpdateTarget(null);
  };

  const counts = {
    total:   posts.length,
    lost:    posts.filter(p => p.status === "lost").length,
    found:   posts.filter(p => p.status === "found").length,
    claimed: posts.filter(p => p.status === "claimed").length,
  };

  return (
    <div className="space-y-5">

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Posts", value: counts.total,   color: "border-violet-200 bg-violet-50",  text: "text-violet-700"  },
          { label: "Lost",        value: counts.lost,    color: "border-red-200 bg-red-50",         text: "text-red-600"     },
          { label: "Found",       value: counts.found,   color: "border-emerald-200 bg-emerald-50", text: "text-emerald-700" },
          { label: "Claimed",     value: counts.claimed, color: "border-slate-200 bg-slate-50",     text: "text-slate-600"   },
        ].map(({ label, value, color, text }) => (
          <div key={label} className={`rounded-xl border px-4 py-3 ${color}`}>
            <p className={`text-2xl font-bold ${text}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by title, location, user, or ID…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-400" />
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {STATUS_FILTERS.map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1); }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${statusFilter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
              <LayoutGrid size={15} />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}>
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Results info */}
      <p className="text-sm text-slate-500 px-1">
        Showing <span className="font-semibold text-slate-700">{paginated.length}</span> of{" "}
        <span className="font-semibold text-slate-700">{filtered.length}</span> posts
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Filter size={32} className="text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No posts found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post}
              onUpdate={(p) => setUpdateTarget(p)}
              onDelete={(p) => setDeleteTarget(p)} />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3 font-semibold">Item</th>
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 font-semibold">Location</th>
                  <th className="text-left px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((post) => (
                  <PostRow key={post.id} post={post}
                    onUpdate={(p) => setUpdateTarget(p)}
                    onDelete={(p) => setDeleteTarget(p)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
          <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === p ? "bg-violet-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-500"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <DeleteConfirmModal
        post={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)} />

      <UpdatePostModal
        post={updateTarget}
        onSave={handleUpdate}
        onCancel={() => setUpdateTarget(null)} />
    </div>
  );
}