"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spareModal, setSpareModal] = useState<any | null>(null);
  const [spareName, setSpareName] = useState("");
  const [acting, setActing] = useState<string | null>(null);

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

  const submitSpare = async () => {
    if (!spareModal || !spareName.trim()) return;
    setActing(spareModal.id);
    try {
      await api.createSpare({ requestId: spareModal.id, spareName });
      await api.updateRequestStatus(spareModal.id, "NEED_SPARE");
      setSpareModal(null); setSpareName("");
      await fetchTasks();
    } catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assigned Tasks</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      <div className="space-y-4">
        {!loading && tasks.length === 0 && <p className="text-gray-400">No tasks assigned to you.</p>}
        {tasks.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</span>
                <h3 className="font-semibold text-gray-800 dark:text-white mt-1">{r.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.description}</p>
                {r.location && <p className="text-xs text-gray-400 mt-1">📍 {r.location}</p>}
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.attachments?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">📎 Attachments:</p>
                <div className="flex gap-2 flex-wrap">
                  {r.attachments.map((p: string, i: number) => (
                    <a key={i} href={`http://localhost:5000${p}`} target="_blank" rel="noopener noreferrer">
                      <img src={`http://localhost:5000${p}`} alt={`att-${i}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {r.status === "ASSIGNED" && (
              <div className="flex gap-2 flex-wrap mt-4">
                <button onClick={() => updateStatus(r.id, "FIXED", "Issue resolved successfully.")} disabled={acting === r.id}
                  className="text-sm bg-green-100 text-green-700 px-4 py-1.5 rounded-full hover:bg-green-200 disabled:opacity-50">Mark Fixed</button>
                <button onClick={() => updateStatus(r.id, "ESCALATED")} disabled={acting === r.id}
                  className="text-sm bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full hover:bg-orange-200 disabled:opacity-50">Escalate</button>
                <button onClick={() => setSpareModal(r)}
                  className="text-sm bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full hover:bg-purple-200">Need Spare</button>
              </div>
            )}
            {r.resolutionNote && <p className="text-xs text-gray-400 mt-2">Note: {r.resolutionNote}</p>}
          </div>
        ))}
      </div>

      {spareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-1">Request Spare Part</h2>
            <p className="text-sm text-gray-500 mb-4">{spareModal.title}</p>
            <input type="text" value={spareName} onChange={(e) => setSpareName(e.target.value)}
              placeholder="Spare part name / description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4" />
            <div className="flex gap-3">
              <button onClick={submitSpare} disabled={!spareName.trim() || !!acting}
                className="flex-1 bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium disabled:opacity-50">Submit Request</button>
              <button onClick={() => setSpareModal(null)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
