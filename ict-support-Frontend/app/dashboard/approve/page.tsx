"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

export default function ApprovePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState<any | null>(null);
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
      <h1 className="text-2xl font-bold mb-6">Pending Requests</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
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
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && requests.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No pending requests.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-700 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-gray-500">{r.submittedBy?.name}</td>
                <td className="px-4 py-3">{r.issueType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600" : r.urgency === "MEDIUM" ? "text-yellow-600" : "text-green-600"}`}>{r.urgency}</span></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => approve(r.id)} disabled={acting} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 disabled:opacity-50">Approve</button>
                  <button onClick={() => setRejectModal(r)} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-1">Reject Request</h2>
            <p className="text-sm text-gray-500 mb-4">{rejectModal.title}</p>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection (required)..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4" />
            <div className="flex gap-3">
              <button onClick={reject} disabled={!reason.trim() || acting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
                {acting ? "Rejecting..." : "Confirm Reject"}
              </button>
              <button onClick={() => setRejectModal(null)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
