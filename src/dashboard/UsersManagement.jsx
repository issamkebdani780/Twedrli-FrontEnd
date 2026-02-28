import { useState } from "react";
import {
  Search, LayoutGrid, List, ChevronLeft, ChevronRight,
  Pencil, Trash2, Filter, UserCheck, UserX, Users as UsersIcon,
  GraduationCap, Shield, X, AlertTriangle, Save, Mail, MapPin, BookOpen, Clock,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "U-001", name: "Amir Meziane",    email: "a.meziane@uabb.dz",   avatar: "AM", role: "Student",  department: "Computer Science", posts: 3, status: "active",    joined: "Sep 2023" },
  { id: "U-002", name: "Karima Bouzid",   email: "k.bouzid@uabb.dz",    avatar: "KB", role: "Student",  department: "Mathematics",      posts: 5, status: "active",    joined: "Oct 2023" },
  { id: "U-003", name: "Yacine Benaissa", email: "y.benaissa@uabb.dz",  avatar: "YB", role: "Staff",    department: "Administration",   posts: 1, status: "active",    joined: "Jan 2022" },
  { id: "U-004", name: "Sara Rahmani",    email: "s.rahmani@uabb.dz",   avatar: "SR", role: "Student",  department: "Engineering",      posts: 2, status: "inactive",  joined: "Sep 2022" },
  { id: "U-005", name: "Fateh Hamidi",    email: "f.hamidi@uabb.dz",    avatar: "FH", role: "Student",  department: "Physics",          posts: 4, status: "active",    joined: "Sep 2023" },
  { id: "U-006", name: "Leila Cherif",    email: "l.cherif@uabb.dz",    avatar: "LC", role: "Student",  department: "Biology",          posts: 1, status: "active",    joined: "Oct 2021" },
  { id: "U-007", name: "Riad Ouali",      email: "r.ouali@uabb.dz",     avatar: "RO", role: "Student",  department: "Electronics",      posts: 2, status: "suspended", joined: "Sep 2023" },
  { id: "U-008", name: "Nadia Salhi",     email: "n.salhi@uabb.dz",     avatar: "NS", role: "Faculty",  department: "Physics",          posts: 1, status: "active",    joined: "Mar 2020" },
  { id: "U-009", name: "Mourad Kaci",     email: "m.kaci@uabb.dz",      avatar: "MK", role: "Student",  department: "Chemistry",        posts: 2, status: "active",    joined: "Sep 2022" },
  { id: "U-010", name: "Houria Belmahi",  email: "h.belmahi@uabb.dz",   avatar: "HB", role: "Faculty",  department: "Mathematics",      posts: 0, status: "active",    joined: "Jun 2019" },
  { id: "U-011", name: "Djamel Ferhat",   email: "d.ferhat@uabb.dz",    avatar: "DF", role: "Staff",    department: "Security",         posts: 0, status: "inactive",  joined: "Aug 2021" },
  { id: "U-012", name: "Imane Oukaci",    email: "i.oukaci@uabb.dz",    avatar: "IO", role: "Student",  department: "Architecture",     posts: 3, status: "active",    joined: "Sep 2023" },
];

const ROLES = ["All", "Student", "Faculty", "Staff"];
const STATUSES = ["All", "Active", "Inactive", "Suspended"];
const DEPARTMENTS = ["Computer Science", "Mathematics", "Administration", "Engineering", "Physics", "Biology", "Electronics", "Chemistry", "Architecture", "Security"];
const PAGE_SIZE = 6;

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const avatarGradients = [
  "from-violet-400 to-indigo-500", "from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500",  "from-teal-400 to-emerald-500",
  "from-sky-400 to-blue-500",      "from-fuchsia-400 to-purple-500",
];
const avatarColor = (s) => avatarGradients[s.charCodeAt(0) % avatarGradients.length];

const statusStyle = {
  active:    "bg-emerald-100 text-emerald-700 border border-emerald-200",
  inactive:  "bg-slate-100 text-slate-500 border border-slate-200",
  suspended: "bg-red-100 text-red-600 border border-red-200",
};

const roleStyle = {
  Student: "bg-violet-50 text-violet-700 border border-violet-100",
  Faculty: "bg-blue-50 text-blue-700 border border-blue-100",
  Staff:   "bg-amber-50 text-amber-700 border border-amber-100",
};

// ─── DELETE MODAL ──────────────────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onCancel }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mb-4 mx-auto">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">Remove User?</h3>
        <p className="text-sm text-slate-500 text-center mt-1 mb-5">
          <span className="font-semibold text-slate-700">{user.name}</span> will be permanently removed from the system.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(user.id)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-red-200">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ────────────────────────────────────────────────────────────────
function EditModal({ user, onSave, onCancel }) {
  const [form, setForm] = useState(user ? { ...user } : {});
  if (!user) return null;

  const field = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const inputCls = "w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all";
  const labelCls = "text-xs font-semibold text-slate-500 mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(user.avatar)} flex items-center justify-center text-white text-xs font-bold`}>
              {user.avatar}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Edit User</h3>
              <p className="text-xs text-slate-400 font-mono">{user.id}</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input {...field("name")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input {...field("email")} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Role</label>
              <select {...field("role")} className={inputCls}>
                {["Student", "Faculty", "Staff"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select {...field("status")} className={inputCls}>
                {["active", "inactive", "suspended"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Department</label>
            <select {...field("department")} className={inputCls}>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(user.id, form)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-sm shadow-violet-200 transition-all">
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── USER CARD (grid) ──────────────────────────────────────────────────────────
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-violet-400 to-indigo-500" />

      <div className="p-5">
        {/* Avatar + status */}
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColor(user.avatar)} flex items-center justify-center text-white text-base font-bold shadow-sm`}>
              {user.avatar}
            </div>
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === "active" ? "bg-emerald-400" : user.status === "suspended" ? "bg-red-400" : "bg-slate-300"}`} />
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${roleStyle[user.role]}`}>
            {user.role}
          </span>
        </div>

        {/* Info */}
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{user.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate">
          <Mail size={10} className="flex-shrink-0" /> {user.email}
        </p>

        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <BookOpen size={11} className="text-violet-400 flex-shrink-0" />
            {user.department}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock size={11} className="text-violet-400 flex-shrink-0" />
            Joined {user.joined}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800 leading-none">{user.posts}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Posts</p>
          </div>
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[user.status]}`}>
            {user.status}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{user.id}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => onEdit(user)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-semibold border border-violet-100">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(user)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold border border-red-100">
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── USER ROW (list) ───────────────────────────────────────────────────────────
function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(user.avatar)} flex items-center justify-center text-white text-xs font-bold`}>
              {user.avatar}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.status === "active" ? "bg-emerald-400" : user.status === "suspended" ? "bg-red-400" : "bg-slate-300"}`} />
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-mono">{user.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">{user.email}</td>
      <td className="px-4 py-3.5">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${roleStyle[user.role]}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">{user.department}</td>
      <td className="px-4 py-3.5 text-center">
        <span className="text-sm font-bold text-slate-700">{user.posts}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-400">{user.joined}</td>
      <td className="px-4 py-3.5">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[user.status]}`}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(user)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-semibold border border-violet-100">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(user)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold border border-red-100">
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers]             = useState(INITIAL_USERS);
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode]       = useState("grid");
  const [page, setPage]               = useState(1);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q)       ||
      u.email.toLowerCase().includes(q)      ||
      u.department.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q);
    const matchRole   = roleFilter === "All"   || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  };

  const handleSave = (id, fields) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...fields } : u)));
    setEditTarget(null);
  };

  const counts = {
    total:     users.length,
    active:    users.filter((u) => u.status === "active").length,
    inactive:  users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-5">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Users",    value: counts.total,     icon: <UsersIcon size={15} />,   color: "border-violet-200 bg-violet-50",   text: "text-violet-700",  iconBg: "bg-gradient-to-br from-violet-500 to-indigo-600" },
          { label: "Active",         value: counts.active,    icon: <UserCheck size={15} />,   color: "border-emerald-200 bg-emerald-50", text: "text-emerald-700", iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500"  },
          { label: "Inactive",       value: counts.inactive,  icon: <UserX size={15} />,       color: "border-slate-200 bg-slate-50",     text: "text-slate-600",   iconBg: "bg-gradient-to-br from-slate-400 to-slate-500"   },
          { label: "Suspended",      value: counts.suspended, icon: <Shield size={15} />,      color: "border-red-200 bg-red-50",         text: "text-red-600",     iconBg: "bg-gradient-to-br from-red-400 to-rose-500"      },
        ].map(({ label, value, icon, color, text, iconBg }) => (
          <div key={label} className={`rounded-2xl border px-4 py-3.5 ${color} flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${iconBg}`}>
              {icon}
            </div>
            <div>
              <p className={`text-2xl font-bold leading-none ${text}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, department, or ID…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-400"
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {ROLES.map((r) => (
              <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${roleFilter === r ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${statusFilter === s ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {s}
              </button>
            ))}
          </div>

          {/* View toggle */}
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

      {/* ── Results count ── */}
      <p className="text-sm text-slate-500 px-1">
        Showing <span className="font-semibold text-slate-700">{paginated.length}</span> of{" "}
        <span className="font-semibold text-slate-700">{filtered.length}</span> users
      </p>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Filter size={32} className="text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No users found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* ── Grid view ── */}
      {viewMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((user) => (
            <UserCard key={user.id} user={user}
              onEdit={(u) => setEditTarget(u)}
              onDelete={(u) => setDeleteTarget(u)} />
          ))}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Department</th>
                  <th className="text-left px-4 py-3 font-semibold">Posts</th>
                  <th className="text-left px-4 py-3 font-semibold">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((user) => (
                  <UserRow key={user.id} user={user}
                    onEdit={(u) => setEditTarget(u)}
                    onDelete={(u) => setDeleteTarget(u)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
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

      {/* ── Modals ── */}
      <EditModal   user={editTarget}   onSave={handleSave}    onCancel={() => setEditTarget(null)} />
      <DeleteModal user={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}