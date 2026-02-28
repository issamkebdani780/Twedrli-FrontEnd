import { Package, CheckCircle, Clock, UserCheck } from "lucide-react";

const stats = [
  {
    label: "Total Lost Items",
    value: "248",
    icon: <Package size={16} />,
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50",
  },
  {
    label: "Total Found Items",
    value: "183",
    icon: <CheckCircle size={16} />,
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
  },
  {
    label: "Total Claimed Items",
    value: "41",
    icon: <Clock size={16} />,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
  },
  {
    label: "Active Users",
    value: "1,204",
    icon: <UserCheck size={16} />,
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
  },
];

const recentItems = [
  {
    id: "LI-0041",
    name: "Black Leather Wallet",
    category: "Accessories",
    location: "Library – Floor 2",
    date: "Today, 10:23 AM",
    status: "Lost",
    avatar: "AM",
  },
  {
    id: "LI-0040",
    name: "Apple AirPods Pro",
    category: "Electronics",
    location: "Faculty of Science",
    date: "Today, 09:15 AM",
    status: "Lost",
    avatar: "KB",
  },
  {
    id: "LI-0039",
    name: "Blue Student ID Card",
    category: "Documents",
    location: "Cafeteria",
    date: "Yesterday, 4:47 PM",
    status: "Found",
    avatar: "YB",
  },
  {
    id: "LI-0038",
    name: "Gray Laptop Bag",
    category: "Bags",
    location: "Auditorium",
    date: "Yesterday, 2:10 PM",
    status: "Claimed",
    avatar: "SR",
  },
  {
    id: "LI-0037",
    name: "Glasses – Black Frame",
    category: "Accessories",
    location: "Room 204 – Eng. Dept.",
    date: "Feb 25, 11:30 AM",
    status: "Found",
    avatar: "FH",
  },
];

const statusStyles = {
  Lost: "bg-amber-100 text-amber-700 border border-amber-200",
  Found: "bg-blue-100 text-blue-700 border border-blue-200",
  Claimed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

function StatsCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}
        >
          <div
            className={`bg-gradient-to-br ${color} rounded-lg w-8 h-8 flex items-center justify-center text-white`}
          >
            {icon}
          </div>
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon, color, bg }) => (
          <StatsCard
            key={label}
            label={label}
            value={value}
            icon={icon}
            color={color}
            bg={bg}
          />
        ))}
      </div>

      {/* ── Recent Items Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">
            Recent Lost Item Reports
          </h2>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold">Item</th>
                <th className="text-left px-5 py-3 font-semibold">Category</th>
                <th className="text-left px-5 py-3 font-semibold">Location</th>
                <th className="text-left px-5 py-3 font-semibold">
                  Reported By
                </th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.id}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    {item.location}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {item.avatar}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-slate-100">
          {recentItems.map((item) => (
            <div key={item.id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {item.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400">
                  {item.location} · {item.date}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${statusStyles[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
