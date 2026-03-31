"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch {}
  };

  // Poll every 10 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id: string) => {
    await api.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await api.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors"
        title="Notifications"
      >
        <span className="text-xl">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-sm dark:text-white">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No notifications</p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !n.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">{n.title.includes("Chat") ? "💬" : n.title.includes("Assigned") ? "🔧" : n.title.includes("Approved") ? "✅" : n.title.includes("Rejected") ? "❌" : n.title.includes("Fixed") ? "🎉" : "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium dark:text-white ${!n.isRead ? "text-blue-900" : "text-gray-700"}`}>{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
