"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchTasks = async () => {
    try {
      const res = await api.getRequests();
      setTasks(res.requests || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const updateStatus = async (id: string, status: string, resolutionNote?: string) => {
    setActing(id);
    try {
      await api.updateRequestStatus(id, status, resolutionNote);
      await fetchTasks();
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const filtered = tasks.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.requestNumber?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Assigned Tasks</h1>

      <div className="flex gap-3 mb-5">
        <input type="text" placeholder="Search by title or ID..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["All", "ASSIGNED", "FIXED", "ESCALATED", "NEED_SPARE"].map((s) => (
            <option key={s} value={s}>{s === "All" ? "All" : s}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="space-y-4">
        {!loading && filtered.length === 0 && (
          <p className="text-gray-400">No tasks found.</p>
        )}

        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</span>
                <h3 className="font-semibold text-gray-800 dark:text-white mt-1">{r.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.description}</p>
                {r.location && <p className="text-xs text-gray-400 mt-1">📍 {r.location}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Submitted by: {r.submittedBy?.name} &nbsp;·&nbsp;
                  <span className={`font-medium ${r.urgency === "HIGH" ? "text-red-500" : r.urgency === "MEDIUM" ? "text-yellow-500" : "text-green-500"}`}>
                    {r.urgency}
                  </span>
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            {/* Attachments */}
            {r.attachments?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">📎 Attachments:</p>
                <div className="flex gap-2 flex-wrap">
                  {r.attachments.map((p: string, i: number) => (
                    <a key={i} href={`${API_BASE}${p}`} target="_blank" rel="noopener noreferrer">
                      <img src={`${API_BASE}${p}`} alt={`att-${i}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {r.status === "ASSIGNED" && (
              <div className="flex gap-2 flex-wrap mt-2">
                <button onClick={() => updateStatus(r.id, "FIXED", "Issue resolved successfully.")} disabled={acting === r.id}
                  className="text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-4 py-1.5 rounded-full hover:bg-green-200 disabled:opacity-50 transition-colors">
                  {acting === r.id ? "Updating..." : "✓ Mark Fixed"}
                </button>
                <button onClick={() => updateStatus(r.id, "ESCALATED")} disabled={acting === r.id}
                  className="text-sm bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-4 py-1.5 rounded-full hover:bg-orange-200 disabled:opacity-50 transition-colors">
                  ⚠️ Escalate
                </button>
                <button onClick={() => updateStatus(r.id, "NEED_SPARE")} disabled={acting === r.id}
                  className="text-sm bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full hover:bg-purple-200 disabled:opacity-50 transition-colors">
                  🔩 Need Spare
                </button>
              </div>
            )}

            {r.resolutionNote && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 border-t border-gray-100 dark:border-gray-700 pt-2">
                Resolution: {r.resolutionNote}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
