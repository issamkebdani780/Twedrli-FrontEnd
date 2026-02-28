import { useState } from "react";
import {
  Search, LayoutGrid, List, ChevronLeft, ChevronRight,
  Filter, MapPin, Clock, Tag, Package, CheckCircle,
  AlertCircle, Layers, Eye, X, ChevronDown,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const ALL_ITEMS = [
  { id: "P-1041", title: "Blue Hydro Flask",       category: "Drinkware",   status: "lost",    location: "Zone Chimie – Lab 2",        zone: "Science Faculty", date: "2h ago",   user: { name: "Amir Meziane",    avatar: "AM" }, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",  description: "Blue 32oz Hydro Flask with a dent on the side, left near the sink." },
  { id: "P-1040", title: "TI-84 Calculator",       category: "Electronics", status: "found",   location: "Main Library – 3rd Floor",   zone: "Library",         date: "6h ago",   user: { name: "Karima Bouzid",   avatar: "KB" }, img: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&q=80",  description: "Found a graphing calculator on one of the study tables." },
  { id: "P-1039", title: "Car Keys & Keychain",    category: "Keys",        status: "claimed", location: "Student Union Cafe",          zone: "Student Union",   date: "1d ago",   user: { name: "Yacine Benaissa", avatar: "YB" }, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",  description: "Toyota key with a black leather keychain and two small keys." },
  { id: "P-1038", title: "Black Laptop Bag",       category: "Bags",        status: "found",   location: "Auditorium – Main Hall",      zone: "Auditorium",      date: "1d ago",   user: { name: "Sara Rahmani",    avatar: "SR" }, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",  description: "Large black laptop bag, Dell brand sticker. Found after lecture." },
  { id: "P-1037", title: "Glasses – Black Frame",  category: "Accessories", status: "lost",    location: "Room 204 – Eng. Dept.",       zone: "Engineering",     date: "2d ago",   user: { name: "Fateh Hamidi",    avatar: "FH" }, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80",  description: "Prescription glasses with black rectangular frames." },
  { id: "P-1036", title: "Student ID – Blue",      category: "Documents",   status: "found",   location: "Cafeteria – Building B",      zone: "Cafeteria",       date: "3d ago",   user: { name: "Leila Cherif",    avatar: "LC" }, img: "https://images.unsplash.com/photo-1586892478025-2b5472316994?w=400&q=80",  description: "University ID card found near the payment counter." },
  { id: "P-1035", title: "Sony Headphones",        category: "Electronics", status: "lost",    location: "Main Library – Floor 1",      zone: "Library",         date: "3d ago",   user: { name: "Riad Ouali",      avatar: "RO" }, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",  description: "Over-ear Sony WH-1000XM4, black. Lost near study pods." },
  { id: "P-1034", title: "Physics Notebook",       category: "Stationery",  status: "found",   location: "Science Hall – Room 12",      zone: "Science Faculty", date: "4d ago",   user: { name: "Nadia Salhi",     avatar: "NS" }, img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",  description: "Green notebook filled with physics equations." },
  { id: "P-1033", title: "AirPods Pro Case",       category: "Electronics", status: "claimed", location: "Student Union – 2nd Floor",   zone: "Student Union",   date: "5d ago",   user: { name: "Mourad Kaci",     avatar: "MK" }, img: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=400&q=80",  description: "White AirPods Pro charging case, no earbuds inside." },
  { id: "P-1032", title: "Red Umbrella",           category: "Accessories", status: "found",   location: "Main Entrance – Hall A",      zone: "Administration",  date: "5d ago",   user: { name: "Houria Belmahi",  avatar: "HB" }, img: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400&q=80",  description: "Bright red folding umbrella found at the main entrance." },
  { id: "P-1031", title: "Silver Watch",           category: "Accessories", status: "lost",    location: "Sports Complex – Locker",     zone: "Sports",          date: "6d ago",   user: { name: "Djamel Ferhat",   avatar: "DF" }, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",  description: "Silver Casio watch with a metal bracelet." },
  { id: "P-1030", title: "USB-C Charger",          category: "Electronics", status: "found",   location: "Engineering Lab – Floor 3",   zone: "Engineering",     date: "1w ago",   user: { name: "Imane Oukaci",    avatar: "IO" }, img: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&q=80",  description: "White 65W USB-C charger, no brand markings." },
];

const CATEGORIES = ["All", "Electronics", "Accessories", "Bags", "Documents", "Drinkware", "Keys", "Stationery"];
const ZONES      = ["All Zones", "Library", "Science Faculty", "Engineering", "Cafeteria", "Student Union", "Auditorium", "Sports", "Administration"];
const STATUSES   = ["All", "Lost", "Found", "Claimed"];
const SORT_OPTIONS = ["Newest First", "Oldest First", "A → Z", "Z → A"];
const PAGE_SIZE  = 8;

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const avatarGradients = [
  "from-violet-400 to-indigo-500","from-pink-400 to-rose-500",
  "from-amber-400 to-orange-500","from-teal-400 to-emerald-500",
  "from-sky-400 to-blue-500","from-fuchsia-400 to-purple-500",
];
const avatarColor = (s) => avatarGradients[s.charCodeAt(0) % avatarGradients.length];

const statusCfg = {
  lost:    { label: "Lost",    dot: "bg-red-400",     badge: "bg-red-100 text-red-700 border border-red-200",         icon: <AlertCircle size={12}/> },
  found:   { label: "Found",   dot: "bg-emerald-400", badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", icon: <CheckCircle size={12}/> },
  claimed: { label: "Claimed", dot: "bg-slate-400",   badge: "bg-slate-100 text-slate-600 border border-slate-200",   icon: <Package size={12}/> },
};

const categoryIcons = {
  Electronics: "💻", Accessories: "👓", Bags: "🎒", Documents: "🪪",
  Drinkware: "🧴", Keys: "🔑", Stationery: "📓",
};

// ─── DETAIL MODAL ──────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  if (!item) return null;
  const cfg = statusCfg[item.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">
        {/* Image */}
        <div className="relative h-56 bg-slate-100 overflow-hidden">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 ${cfg.badge}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="font-bold text-slate-800 text-lg leading-tight">{item.title}</h2>
            <span className="text-xs text-slate-400 font-mono flex-shrink-0 mt-1">{item.id}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium mb-3">
            <Tag size={10} /> {item.category}
          </span>

          <p className="text-sm text-slate-500 leading-relaxed mb-4">{item.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Location</p>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <MapPin size={11} className="text-violet-400 flex-shrink-0" />{item.location}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Zone</p>
              <p className="text-xs font-medium text-slate-700">{item.zone}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Reported By</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarColor(item.user.avatar)} flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0`}>
                  {item.user.avatar}
                </div>
                <p className="text-xs font-medium text-slate-700 truncate">{item.user.name}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</p>
              <p className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Clock size={11} className="text-violet-400 flex-shrink-0" />{item.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ITEM CARD (grid) ──────────────────────────────────────────────────────────
function ItemCard({ item, onView }) {
  const cfg = statusCfg[item.status];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group cursor-pointer" onClick={() => onView(item)}>
      {/* Image */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img src={item.img} alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => e.target.style.display="none"} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm ${cfg.badge}`}>
            {cfg.icon} {cfg.label}
          </span>
        </div>

        {/* Category emoji */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-sm shadow-sm">
          {categoryIcons[item.category] ?? "📦"}
        </div>

        {/* View overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Eye size={12} /> View Details
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{item.title}</h3>
          <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 mt-0.5">{item.id}</span>
        </div>

        <span className="inline-block text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium mb-2">
          {item.category}
        </span>

        <p className="text-xs text-slate-400 flex items-center gap-1 mb-1">
          <MapPin size={10} className="text-violet-400 flex-shrink-0" />
          <span className="truncate">{item.location}</span>
        </p>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor(item.user.avatar)} flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}>
              {item.user.avatar}
            </div>
            <p className="text-xs text-slate-500 truncate max-w-[90px]">{item.user.name}</p>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Clock size={9} /> {item.date}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── ITEM ROW (list) ───────────────────────────────────────────────────────────
function ItemRow({ item, onView }) {
  const cfg = statusCfg[item.status];
  return (
    <tr className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => onView(item)}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
            <div className="absolute top-0.5 right-0.5 text-[10px]">{categoryIcons[item.category] ?? "📦"}</div>
          </div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">{item.title}</p>
            <p className="text-[10px] text-slate-400 font-mono">{item.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">{item.category}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={10} className="text-violet-400 flex-shrink-0" />{item.location}</span>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-500">{item.zone}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor(item.user.avatar)} flex items-center justify-center text-white text-[9px] font-bold`}>
            {item.user.avatar}
          </div>
          <span className="text-xs text-slate-600">{item.user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
        <span className="flex items-center gap-1"><Clock size={10} />{item.date}</span>
      </td>
      <td className="px-4 py-3.5">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 w-fit ${cfg.badge}`}>
          {cfg.icon} {cfg.label}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <button onClick={(e) => { e.stopPropagation(); onView(item); }}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-semibold border border-violet-100">
          <Eye size={12} /> View
        </button>
      </td>
    </tr>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [search, setSearch]         = useState("");
  const [category, setCategory]     = useState("All");
  const [zone, setZone]             = useState("All Zones");
  const [statusF, setStatusF]       = useState("All");
  const [sortBy, setSortBy]         = useState("Newest First");
  const [viewMode, setViewMode]     = useState("grid");
  const [page, setPage]             = useState(1);
  const [selected, setSelected]     = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = ALL_ITEMS.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || item.user.name.toLowerCase().includes(q);
    const matchCat    = category === "All"       || item.category === category;
    const matchZone   = zone === "All Zones"     || item.zone === zone;
    const matchStatus = statusF === "All"        || item.status === statusF.toLowerCase();
    return matchSearch && matchCat && matchZone && matchStatus;
  }).sort((a, b) => {
    if (sortBy === "A → Z") return a.title.localeCompare(b.title);
    if (sortBy === "Z → A") return b.title.localeCompare(a.title);
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    total:   ALL_ITEMS.length,
    lost:    ALL_ITEMS.filter(i => i.status === "lost").length,
    found:   ALL_ITEMS.filter(i => i.status === "found").length,
    claimed: ALL_ITEMS.filter(i => i.status === "claimed").length,
  };

  const selectCls = "text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-7 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none cursor-pointer";

  return (
    <div className="space-y-5">

      {/* ── Summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Items", value: counts.total,   color: "border-violet-200 bg-violet-50",   text: "text-violet-700",  iconBg: "bg-gradient-to-br from-violet-500 to-indigo-600", icon: <Layers size={15}/> },
          { label: "Lost",        value: counts.lost,    color: "border-red-200 bg-red-50",          text: "text-red-600",     iconBg: "bg-gradient-to-br from-red-400 to-rose-500",      icon: <AlertCircle size={15}/> },
          { label: "Found",       value: counts.found,   color: "border-emerald-200 bg-emerald-50",  text: "text-emerald-700", iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",  icon: <CheckCircle size={15}/> },
          { label: "Claimed",     value: counts.claimed, color: "border-slate-200 bg-slate-50",      text: "text-slate-600",   iconBg: "bg-gradient-to-br from-slate-400 to-slate-500",   icon: <Package size={15}/> },
        ].map(({ label, value, color, text, iconBg, icon }) => (
          <div key={label} className={`rounded-2xl border px-4 py-3.5 ${color} flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-sm ${iconBg}`}>{icon}</div>
            <div>
              <p className={`text-2xl font-bold leading-none ${text}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
        {/* Row 1: search + view toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search items by title, location, user, or ID…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all placeholder-slate-400" />
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${showFilters ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
            <Filter size={13} /> Filters {showFilters ? <ChevronDown size={12} className="rotate-180 transition-transform" /> : <ChevronDown size={12} className="transition-transform" />}
          </button>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}><LayoutGrid size={15} /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-slate-800" : "text-slate-400 hover:text-slate-600"}`}><List size={15} /></button>
          </div>
        </div>

        {/* Row 2: filters (collapsible) */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
            {/* Status pills */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {STATUSES.map(s => (
                <button key={s} onClick={() => { setStatusF(s); setPage(1); }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${statusF === s ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{s}</button>
              ))}
            </div>

            {/* Category select */}
            <div className="relative">
              <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className={selectCls}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Zone select */}
            <div className="relative">
              <select value={zone} onChange={e => { setZone(e.target.value); setPage(1); }} className={selectCls}>
                {ZONES.map(z => <option key={z}>{z}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort select */}
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectCls}>
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Clear filters */}
            {(category !== "All" || zone !== "All Zones" || statusF !== "All") && (
              <button onClick={() => { setCategory("All"); setZone("All Zones"); setStatusF("All"); setPage(1); }}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold px-2 transition-colors">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Category quick-tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }}
            className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 border
              ${category === c
                ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"}`}>
            {c !== "All" && <span>{categoryIcons[c] ?? "📦"}</span>}
            {c}
          </button>
        ))}
      </div>

      {/* ── Results info ── */}
      <p className="text-sm text-slate-500 px-1">
        Showing <span className="font-semibold text-slate-700">{paginated.length}</span> of{" "}
        <span className="font-semibold text-slate-700">{filtered.length}</span> items
      </p>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Filter size={32} className="text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No items found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* ── Grid view ── */}
      {viewMode === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {paginated.map(item => <ItemCard key={item.id} item={item} onView={setSelected} />)}
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/60">
                  {["Item","Category","Location","Zone","Reported By","Date","Status","Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map(item => <ItemRow key={item.id} item={item} onView={setSelected} />)}
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
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page===p ? "bg-violet-600 text-white shadow-sm" : "hover:bg-slate-100 text-slate-500"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}