"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function ApprovePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null); // stores the id being acted on
  const [rejectModal, setRejectModal] = useState<any | null>(null);
  const [viewModal, setViewModal] = useState<any | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getRequests({ status: "PENDING" });
      setRequests(res.requests || []);
    } catch (e: any) {
      setError(e.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const approve = async (id: string) => {
    setActing(id);
    setError("");
    try {
      await api.approveRequest(id);
      await fetchRequests();
    } catch (e: any) {
      setError(e.message || "Failed to approve request");
    } finally {
      setActing(null);
    }
  };

  const reject = async () => {
    if (!rejectModal || !reason.trim()) return;
    setActing(rejectModal.id);
    setError("");
    try {
      await api.rejectRequest(rejectModal.id, reason);
      setRejectModal(null);
      setReason("");
      await fetchRequests();
    } catch (e: any) {
      setError(e.message || "Failed to reject request");
    } finally {
      setActing(null);
    }
  };

  const filtered = requests.filter((r) =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
    r.submittedBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Pending Requests</h1>

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <input type="text" placeholder="Search by title, ID, or submitter..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-80 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Submitted By</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No pending requests.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">
                  <button onClick={() => setViewModal(r)} className="hover:underline text-left">
                    {r.title}
                  </button>
                  {r.attachments?.length > 0 && (
                    <span className="ml-1 text-xs text-gray-400">📎 {r.attachments.length}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.submittedBy?.name}</td>
                <td className="px-4 py-3 dark:text-gray-300">{r.issueType}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    r.urgency === "HIGH" ? "text-red-600 dark:text-red-400" :
                    r.urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" :
                    "text-green-600 dark:text-green-400"
                  }`}>{r.urgency}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(r.id)}
                      disabled={acting === r.id}
                      className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full hover:bg-green-200 disabled:opacity-50 font-medium transition-colors"
                    >
                      {acting === r.id ? "..." : "✓ Approve"}
                    </button>
                    <button
                      onClick={() => setRejectModal(r)}
                      disabled={acting === r.id}
                      className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-full hover:bg-red-200 disabled:opacity-50 font-medium transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Detail Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{viewModal.requestNumber}</span>
                <h2 className="text-lg font-bold dark:text-white mt-1">{viewModal.title}</h2>
              </div>
              <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">✕</button>
            </div>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={viewModal.status} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  viewModal.urgency === "HIGH" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                  viewModal.urgency === "MEDIUM" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                }`}>{viewModal.urgency}</span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{viewModal.issueType}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium mb-1">Description</p>
                <p className="text-gray-700 dark:text-gray-300">{viewModal.description}</p>
              </div>
              {viewModal.location && (
                <p className="text-gray-500 dark:text-gray-400">📍 {viewModal.location}</p>
              )}
              <p className="text-xs text-gray-400">
                Submitted by: <span className="font-medium text-gray-600 dark:text-gray-300">{viewModal.submittedBy?.name}</span>
                &nbsp;·&nbsp; {new Date(viewModal.createdAt).toLocaleString()}
              </p>
              {viewModal.attachments?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium mb-2">Attachments</p>
                  <div className="flex gap-2 flex-wrap">
                    {viewModal.attachments.map((p: string, i: number) => (
                      <a key={i} href={`${API_BASE}${p}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_BASE}${p}`} alt={`att-${i}`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { approve(viewModal.id); setViewModal(null); }}
                disabled={acting === viewModal.id}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => { setRejectModal(viewModal); setViewModal(null); }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                ✕ Reject
              </button>
              <button
                onClick={() => setViewModal(null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Close
              </button>
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
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rejection (required)..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={reject}
                disabled={!reason.trim() || acting === rejectModal.id}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {acting === rejectModal.id ? "Rejecting..." : "Confirm Reject"}
              </button>
              <button
                onClick={() => { setRejectModal(null); setReason(""); }}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
