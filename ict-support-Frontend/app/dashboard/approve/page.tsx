"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function ApprovePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<any | null>(null);
  const [viewModal, setViewModal] = useState<any | null>(null);
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await api.getRequests({ status: "PENDING" });
      setRequests(res.requests || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const approve = async (id: string) => {
    setActing(true);
    try { await api.approveRequest(id); await fetchRequests(); }
    catch (e) { console.error(e); }
    finally { setActing(false); }
  };

  const reject = async () => {
    if (!rejectModal) return;
    setActing(true);
    try {
      await api.rejectRequest(rejectModal.id, reason);
      setRejectModal(null); setReason("");
      await fetchRequests();
    } catch (e) { console.error(e); }
    finally { setActing(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Pending Requests</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Submitted By</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && requests.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No pending requests.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">
                  <button onClick={() => setViewModal(r)} className="hover:underline text-left">{r.title}</button>
                  {r.attachments?.length > 0 && <span className="ml-1 text-xs text-gray-400">📎{r.attachments.length}</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.submittedBy?.name}</td>
                <td className="px-4 py-3 dark:text-gray-300">{r.issueType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600 dark:text-red-400" : r.urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>{r.urgency}</span></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => approve(r.id)} disabled={acting} className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 disabled:opacity-50">Approve</button>
                  <button onClick={() => setRejectModal(r)} className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full hover:bg-red-200">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{viewModal.requestNumber}</span>
                <h2 className="text-lg font-bold dark:text-white mt-1">{viewModal.title}</h2>
              </div>
              <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-gray-700 dark:text-gray-300">{viewModal.description}</p>
              {viewModal.location && <p className="text-gray-500 dark:text-gray-400">📍 {viewModal.location}</p>}
              {viewModal.attachments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase font-medium">Attachments</p>
                  <div className="flex gap-2 flex-wrap">
                    {viewModal.attachments.map((p: string, i: number) => (
                      <a key={i} href={`${API_BASE}${p}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_BASE}${p}`} alt={`att-${i}`} className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-80" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { approve(viewModal.id); setViewModal(null); }} disabled={acting}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50">Approve</button>
              <button onClick={() => { setRejectModal(viewModal); setViewModal(null); }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium">Reject</button>
              <button onClick={() => setViewModal(null)} className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-1 dark:text-white">Reject Request</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{rejectModal.title}</p>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection (required)..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4" />
            <div className="flex gap-3">
              <button onClick={reject} disabled={!reason.trim() || acting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
                {acting ? "Rejecting..." : "Confirm Reject"}
              </button>
              <button onClick={() => setRejectModal(null)} className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
