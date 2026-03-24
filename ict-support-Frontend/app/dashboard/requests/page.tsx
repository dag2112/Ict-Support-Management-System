"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import FeedbackModal from "@/components/FeedbackModal";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [feedbackRequest, setFeedbackRequest] = useState<any | null>(null);

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

  useEffect(() => { fetchRequests(); }, [search, filterStatus]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>
      <div className="flex gap-3 mb-5">
        <input type="text" placeholder="Search by ID, title, type..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["All", "PENDING", "APPROVED", "REJECTED", "ASSIGNED", "FIXED", "ESCALATED", "NEED_SPARE"].map((s) => (
            <option key={s} value={s}>{s === "All" ? "All" : s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && requests.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No requests found.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-700 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-gray-500">{r.issueType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600" : r.urgency === "MEDIUM" ? "text-yellow-600" : "text-green-600"}`}>{r.urgency}</span></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {r.status === "FIXED" && !r.feedback && (
                    <button onClick={() => setFeedbackRequest(r)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200">Give Feedback</button>
                  )}
                  {r.feedback && <span className="text-xs text-gray-400">Feedback given ✓</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedbackRequest && (
        <FeedbackModal request={feedbackRequest} onClose={() => { setFeedbackRequest(null); fetchRequests(); }} />
      )}
    </div>
  );
}
