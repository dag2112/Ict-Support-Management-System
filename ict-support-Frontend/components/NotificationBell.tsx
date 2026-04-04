"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const getIcon = (title: string) => {
  if (title.includes("Assigned")) return "🔧";
  if (title.includes("Approved")) return "✅";
  if (title.includes("Rejected")) return "❌";
  if (title.includes("Fixed")) return "🎉";
  if (title.includes("Escalated")) return "⚠️";
  if (title.includes("Spare")) return "🔩";
  return "🔔";
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Load existing notifications on mount
  useEffect(() => {
    if (!user) return;
    api.getNotifications().then(setNotifications).catch(() => {});
  }, [user]);

  // Real-time socket connection
  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      socket.emit("join", user.id);
    });

    // When a new notification arrives, prepend it and show a browser notification if supported
    socket.on("notification", (notif: any) => {
      setNotifications((prev) => [notif, ...prev]);

      // Browser notification (if permission granted)
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(notif.title, { body: notif.message, icon: "/favicon.ico" });
      }
    });

    return () => { socket.disconnect(); };
  }, [user]);

  // Request browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id: string) => {
    try {
      await api.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <div className="relative flex-1" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-blue-800 dark:hover:bg-gray-700 transition-colors text-sm"
      >
        <span className="text-lg">🔔</span>
        <span className="text-blue-100 dark:text-gray-300">Notifications</span>
        {unread > 0 && (
          <span className="ml-auto min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown — opens to the right of the sidebar */}
      {open && (
        <div className="fixed left-64 bottom-24 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-gray-800 dark:text-white">Notifications</h3>
              {unread > 0 && (
                <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.length === 0 && (
              <div className="text-center py-10">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            )}
            {notifications.map((n) => (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}
                className={`px-4 py-3 transition-colors ${
                  !n.isRead
                    ? "bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5 flex-shrink-0">{getIcon(n.title)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!n.isRead ? "text-blue-900 dark:text-blue-200" : "text-gray-700 dark:text-gray-300"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
              <a href="/dashboard/notifications" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
