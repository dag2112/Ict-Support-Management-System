"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getAuditLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.entity.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Audit Logs</h1>

      <input type="text" placeholder="Search by action, entity, or user..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-80 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Performed By</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Details</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No logs found.</td></tr>}
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {l.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{l.entity}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">{l.user?.name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 capitalize text-xs">{l.user?.role?.toLowerCase()}</td>
                <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{l.details ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
