"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try { setNotifications(await api.getNotifications()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    try { await api.markRead(id); await fetchNotifications(); }
    catch (e) { console.error(e); }
  };

  const markAllRead = async () => {
    try { await api.markAllRead(); await fetchNotifications(); }
    catch (e) { console.error(e); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && notifications.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔔</div>
          <p>No notifications yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
              n.isRead
                ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? "bg-gray-300 dark:bg-gray-600" : "bg-blue-500"}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${n.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                {n.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            {!n.isRead && (
              <button onClick={() => markRead(n.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0">
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
