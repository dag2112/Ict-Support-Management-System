"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const navItems: Record<string, { label: string; href: string; icon: string }[]> = {
  REQUESTER: [
    { label: "Dashboard",      href: "/dashboard",          icon: "🏠" },
    { label: "Submit Request", href: "/dashboard/submit",   icon: "➕" },
    { label: "My Requests",    href: "/dashboard/requests", icon: "📋" },
    { label: "ICT Location",   href: "/dashboard/map",      icon: "📍" },
    { label: "My Profile",     href: "/dashboard/profile",  icon: "👤" },
  ],
  APPROVER: [
    { label: "Dashboard",        href: "/dashboard",         icon: "🏠" },
    { label: "Pending Requests", href: "/dashboard/approve", icon: "✅" },
    { label: "My Profile",       href: "/dashboard/profile", icon: "👤" },
  ],
  TECHNICIAN: [
    { label: "Dashboard",      href: "/dashboard",          icon: "🏠" },
    { label: "Assigned Tasks", href: "/dashboard/tasks",    icon: "🔧" },
    { label: "Assets",         href: "/dashboard/assets",   icon: "💻" },
    { label: "My Profile",     href: "/dashboard/profile",  icon: "👤" },
  ],
  MANAGER: [
    { label: "Dashboard",         href: "/dashboard",         icon: "🏠" },
    { label: "Assign Technician", href: "/dashboard/assign",  icon: "👥" },
    { label: "Spare Requests",    href: "/dashboard/spares",  icon: "🔩" },
    { label: "Reports",           href: "/dashboard/reports", icon: "📊" },
    { label: "Users",             href: "/dashboard/users",   icon: "👤" },
    { label: "Assets",            href: "/dashboard/assets",  icon: "💻" },
    { label: "My Profile",        href: "/dashboard/profile", icon: "⚙️" },
  ],
  STOREKEEPER: [
    { label: "Dashboard",      href: "/dashboard",        icon: "🏠" },
    { label: "Spare Requests", href: "/dashboard/store",  icon: "📦" },
    { label: "My Profile",     href: "/dashboard/profile",icon: "👤" },
  ],
  ADMIN: [
    { label: "Dashboard",    href: "/dashboard",         icon: "🏠" },
    { label: "Manage Users", href: "/dashboard/users",   icon: "👥" },
    { label: "Assets",       href: "/dashboard/assets",  icon: "💻" },
    { label: "Reports",      href: "/dashboard/reports", icon: "📊" },
    { label: "Audit Logs",   href: "/dashboard/audit",   icon: "📜" },
    { label: "ICT Location", href: "/dashboard/map",     icon: "📍" },
    { label: "My Profile",   href: "/dashboard/profile", icon: "⚙️" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;
  const items = navItems[user.role] ?? [];

  const NavContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <Link key={item.href} href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-blue-700 dark:bg-gray-700 font-semibold"
                : "hover:bg-blue-800 dark:hover:bg-gray-800 text-blue-100 dark:text-gray-300"
            }`}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-800 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-700 dark:bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-blue-300 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full text-sm bg-blue-800 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-900 dark:bg-gray-900 text-white flex items-center justify-between px-4 py-3 border-b border-blue-800 dark:border-gray-700">
        <div>
          <p className="font-bold text-sm">ICT Support</p>
          <p className="text-xs text-blue-300 dark:text-gray-400">Woldia University</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 z-40 bg-blue-900 dark:bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-blue-800 dark:border-gray-700 pt-16">
          <p className="text-xs uppercase tracking-widest text-blue-300 dark:text-gray-400">Woldia University</p>
          <p className="font-bold text-lg mt-1">ICT Support</p>
        </div>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-blue-900 dark:bg-gray-900 text-white flex-col border-r border-blue-800 dark:border-gray-700 flex-shrink-0">
        <div className="p-6 border-b border-blue-800 dark:border-gray-700">
          <p className="text-xs uppercase tracking-widest text-blue-300 dark:text-gray-400">Woldia University</p>
          <p className="font-bold text-lg mt-1">ICT Support</p>
        </div>
        <NavContent />
      </aside>
    </>
  );
}
