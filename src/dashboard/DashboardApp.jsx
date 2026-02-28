import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  Menu,
  ChevronLeft,
  Bell,
  Search,
} from "lucide-react";

import Dashboard from "./Dashboard";
import ManagePosts from "./Manageposts";

const navItems = [
  { label: "Dashboard", key: "dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Manage Posts", key: "posts", icon: <ClipboardList size={18} /> },
  { label: "Users", key: "users", icon: <Users size={18} /> },
  { label: "Reports", key: "reports", icon: <BarChart2 size={18} /> },
  { label: "Settings", key: "settings", icon: <Settings size={18} /> },
];

function renderPage(activeNav) {
  switch (activeNav) {
    case "dashboard":
      return <Dashboard />;
    case "posts": return <ManagePosts />;
    // case "users":     return <UsersPage />;
    // case "reports":   return <Reports />;
    // case "settings":  return <SettingsPage />;
    default:
      return <p>Not found</p>;
  }
}

function Sidebar({
  sidebarOpen,
  mobile,
  activeNav,
  setActiveNav,
  setMobileOpen,
}) {
  return (
    <aside
      className={`
        flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 transition-all duration-300 ease-in-out
        ${mobile ? "w-64" : sidebarOpen ? "w-64" : "w-[72px]"}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${!sidebarOpen && !mobile ? "justify-center" : ""}`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        {(sidebarOpen || mobile) && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-slate-800 leading-tight tracking-wide">
              Twedrli Admin
            </p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">
              Univ. Abu Baker Belkaid
            </p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {(sidebarOpen || mobile) && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-3">
            Main Menu
          </p>
        )}
        {navItems.map(({ label, key, icon }) => {
          const active = activeNav === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveNav(key);
                setMobileOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                ${
                  active
                    ? "bg-violet-50 text-violet-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }
                ${!sidebarOpen && !mobile ? "justify-center px-2" : ""}
              `}
            >
              <span
                className={`flex-shrink-0 transition-colors ${active ? "text-violet-600" : "text-slate-400 group-hover:text-slate-700"}`}
              >
                {icon}
              </span>
              {(sidebarOpen || mobile) && (
                <span className="truncate">{label}</span>
              )}
              {(sidebarOpen || mobile) && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-3 border-t border-slate-100">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors ${!sidebarOpen && !mobile ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            AD
          </div>
          {(sidebarOpen || mobile) && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">
                Admin User
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                3alamya@gmail.com
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function DashboardApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex flex-shrink-0 transition-all duration-300"
        style={{ width: sidebarOpen ? 256 : 72 }}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          mobile={false}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full">
            <Sidebar
              sidebarOpen={sidebarOpen}
              mobile={true}
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shadow-sm">
          {/* Desktop sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Menu size={18} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
            {/* Admin avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {navItems.find((n) => n.key === activeNav)?.label ?? "Dashboard"}
            </h1>
          </div>

          {/* Render active page */}
          {renderPage(activeNav)}
        </main>
      </div>
    </div>
  );
}
