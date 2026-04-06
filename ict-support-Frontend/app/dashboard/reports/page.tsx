"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [techPerf, setTechPerf] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState<"overview"|"requests"|"feedback">("overview");

  useEffect(() => {
    Promise.all([
      api.getReportSummary(),
      api.getTechnicianPerformance(),
      api.getFeedback(),
      api.getRequests({ limit: "100" }),
    ])
      .then(([s, t, f, r]) => {
        setSummary(s);
        setTechPerf(t);
        setFeedbacks(f);
        setRequests(r.requests || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (dateFrom && new Date(r.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(r.createdAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-900 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Reports & Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["overview", "requests", "feedback"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "bg-blue-900 text-white dark:bg-blue-700"
                : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Requests" value={summary?.total ?? 0} />
            <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
            <StatCard label="Pending" value={summary?.pending ?? 0} color="bg-yellow-50" />
            <StatCard label="Escalated" value={summary?.escalated ?? 0} color="bg-orange-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold dark:text-gray-200 mb-4">Requests by Issue Type</h2>
              <div className="space-y-3">
                {(summary?.byIssueType || []).map(({ issueType, count }: any) => (
                  <div key={issueType}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="dark:text-gray-300">{issueType}</span>
                      <span className="font-medium dark:text-gray-200">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: summary.total > 0 ? `${(count / summary.total) * 100}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold dark:text-gray-200 mb-4">Requests by Urgency</h2>
              <div className="flex gap-6 justify-center py-4">
                {(summary?.byUrgency || []).map(({ urgency, count }: any) => (
                  <div key={urgency} className="text-center">
                    <p className="text-4xl font-bold dark:text-white">{count}</p>
                    <p className={`text-sm font-medium mt-1 ${urgency === "HIGH" ? "text-red-600 dark:text-red-400" : urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>{urgency}</p>
                  </div>
                ))}
              </div>
              {summary?.avgFeedbackRating && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Avg Feedback Rating: <span className="font-bold text-yellow-500">{"★".repeat(Math.round(summary.avgFeedbackRating))} {summary.avgFeedbackRating.toFixed(1)}/5</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold dark:text-gray-200 mb-4">Technician Performance</h2>
            <table className="w-full text-sm">
              <thead className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                <tr>
                  <th className="text-left pb-3">Technician</th>
                  <th className="text-left pb-3">Assigned</th>
                  <th className="text-left pb-3">Fixed</th>
                  <th className="text-left pb-3">Escalated</th>
                  <th className="text-left pb-3">Fix Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {techPerf.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 dark:text-gray-200">{t.name}</td>
                    <td className="py-2 dark:text-gray-300">{t.assigned}</td>
                    <td className="py-2 text-green-600 dark:text-green-400">{t.fixed}</td>
                    <td className="py-2 text-orange-600 dark:text-orange-400">{t.escalated}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${t.fixRate}%` }} />
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-medium">{t.fixRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests Tab with date filter */}
      {activeTab === "requests" && (
        <div>
          <div className="flex gap-4 mb-5 items-end flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From Date</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To Date</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                Clear filter
              </button>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">{filteredRequests.length} requests</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Submitted By</th>
                  <th className="px-4 py-3 text-left">Assigned To</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredRequests.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No requests found.</td></tr>}
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</td>
                    <td className="px-4 py-3 dark:text-gray-200">{r.title}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.issueType}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.submittedBy?.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.assignedTo?.name ?? "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Request</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Comment</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {feedbacks.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No feedback yet.</td></tr>}
              {feedbacks.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{f.request?.requestNumber}</td>
                  <td className="px-4 py-3 dark:text-gray-200">{f.user?.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-yellow-500">{"★".repeat(f.rating)}</span>
                    <span className="text-gray-300 dark:text-gray-600">{"★".repeat(5 - f.rating)}</span>
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{f.rating}/5</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{f.comment || "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
