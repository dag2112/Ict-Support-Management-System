"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import FeedbackModal from "@/components/FeedbackModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [feedbackRequest, setFeedbackRequest] = useState<any | null>(null);
  const [viewRequest, setViewRequest] = useState<any | null>(null);

  const fetchRequests = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (filterStatus !== "All") params.status = filterStatus;
      const res = await api.getRequests(params);
      setRequests(res.requests || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const escalate = async (id: string) => {
    try { await api.escalateRequest(id); await fetchRequests(); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { fetchRequests(); }, [search, filterStatus]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Requests</h1>

      <div className="flex gap-3 mb-5">
        <input type="text" placeholder="Search by ID, title, type..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["All","PENDING","APPROVED","REJECTED","ASSIGNED","FIXED","ESCALATED","NEED_SPARE"].map((s) => (
            <option key={s} value={s}>{s === "All" ? "All" : s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && requests.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No requests found.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">
                  <button onClick={() => setViewRequest(r)} className="hover:underline text-left">{r.title}</button>
                  {r.attachments?.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">📎 {r.attachments.length}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.issueType}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600 dark:text-red-400" : r.urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>{r.urgency}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setViewRequest(r)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View</button>
                  {r.status === "FIXED" && !r.feedback && (
                    <button onClick={() => setFeedbackRequest(r)} className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200">Feedback</button>
                  )}
                  {r.feedback && <span className="ml-2 text-xs text-gray-400">✓ Rated</span>}
                  {(r.status === "ASSIGNED" || r.status === "PENDING" || r.status === "APPROVED") && (
                    <button onClick={() => escalate(r.id)} className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full hover:bg-orange-200">Escalate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Request Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{viewRequest.requestNumber}</span>
                <h2 className="text-lg font-bold dark:text-white mt-1">{viewRequest.title}</h2>
              </div>
              <button onClick={() => setViewRequest(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-2 flex-wrap">
                <StatusBadge status={viewRequest.status} />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${viewRequest.urgency === "HIGH" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : viewRequest.urgency === "MEDIUM" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"}`}>
                  {viewRequest.urgency}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{viewRequest.issueType}</span>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">Description</p>
                <p className="text-gray-700 dark:text-gray-300">{viewRequest.description}</p>
              </div>

              {viewRequest.location && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">Location</p>
                  <p className="text-gray-700 dark:text-gray-300">📍 {viewRequest.location}</p>
                </div>
              )}

              {viewRequest.assignedTo && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">Assigned To</p>
                  <p className="text-gray-700 dark:text-gray-300">🔧 {viewRequest.assignedTo.name}</p>
                </div>
              )}

              {viewRequest.resolutionNote && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-1">Resolution Note</p>
                  <p className="text-gray-700 dark:text-gray-300">{viewRequest.resolutionNote}</p>
                </div>
              )}

              {viewRequest.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-xs font-medium mb-1">Rejection Reason</p>
                  <p className="text-red-700 dark:text-red-300 text-sm">{viewRequest.rejectionReason}</p>
                </div>
              )}

              {/* Attachments */}
              {viewRequest.attachments?.length > 0 && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-medium mb-2">Attachments</p>
                  <div className="flex gap-3 flex-wrap">
                    {viewRequest.attachments.map((path: string, i: number) => (
                      <a key={i} href={`${API_BASE}${path}`} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`${API_BASE}${path}`}
                          alt={`attachment-${i + 1}`}
                          className="w-28 h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-600 hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-400 text-xs">Submitted: {new Date(viewRequest.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-5 flex gap-3">
              {viewRequest.status === "FIXED" && !viewRequest.feedback && (
                <button onClick={() => { setViewRequest(null); setFeedbackRequest(viewRequest); }}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">
                  Give Feedback
                </button>
              )}
              <button onClick={() => setViewRequest(null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackRequest && (
        <FeedbackModal request={feedbackRequest} onClose={() => { setFeedbackRequest(null); fetchRequests(); }} />
      )}
    </div>
  );
}
