"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function AssignPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getRequests({ status: "APPROVED" }), api.getTechnicians()])
      .then(([reqRes, techs]) => { setRequests(reqRes.requests || []); setTechnicians(techs); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const assign = async (requestId: string) => {
    const technicianId = selected[requestId];
    if (!technicianId) return;
    setActing(requestId);
    try {
      await api.assignRequest(requestId, technicianId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Assign Technician</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      <div className="space-y-4">
        {!loading && requests.length === 0 && <p className="text-gray-400">No approved requests awaiting assignment.</p>}
        {requests.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex items-center justify-between gap-4 border border-gray-100 dark:border-gray-700">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</span>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{r.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {r.submittedBy?.name} · {r.issueType} ·{" "}
                <span className={r.urgency === "HIGH" ? "text-red-600 dark:text-red-400" : r.urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}>
                  {r.urgency}
                </span>
              </p>
              {r.location && <p className="text-xs text-gray-400 mt-0.5">📍 {r.location}</p>}
            </div>
            <div className="flex items-center gap-3">
              <select value={selected[r.id] ?? ""} onChange={(e) => setSelected({ ...selected, [r.id]: e.target.value })}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select technician</option>
                {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button onClick={() => assign(r.id)} disabled={!selected[r.id] || acting === r.id}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50">
                {acting === r.id ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
