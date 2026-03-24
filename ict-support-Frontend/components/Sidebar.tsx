"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const navItems: Record<string, { label: string; href: string }[]> = {
  requester: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Submit Request", href: "/dashboard/submit" },
    { label: "My Requests", href: "/dashboard/requests" },
  ],
  approver: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pending Requests", href: "/dashboard/approve" },
  ],
  technician: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Assigned Tasks", href: "/dashboard/tasks" },
  ],
  manager: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Assign Technician", href: "/dashboard/assign" },
    { label: "Spare Requests", href: "/dashboard/spares" },
    { label: "Reports", href: "/dashboard/reports" },
    { label: "Users", href: "/dashboard/users" },
  ],
  storekeeper: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Spare Requests", href: "/dashboard/store" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Users", href: "/dashboard/users" },
    { label: "Assets", href: "/dashboard/assets" },
    { label: "Reports", href: "/dashboard/reports" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  if (!user) return null;
  const items = navItems[user.role] ?? [];

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <p className="text-xs uppercase tracking-widest text-blue-300">ICT Support</p>
        <p className="font-bold text-lg mt-1">Woldia University</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-blue-700 font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-700">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-blue-300 capitalize">{user.role}</p>
        <button
          onClick={logout}
          className="mt-3 w-full text-sm bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
