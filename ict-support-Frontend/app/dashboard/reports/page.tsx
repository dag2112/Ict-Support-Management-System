"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [techPerf, setTechPerf] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getReportSummary(), api.getTechnicianPerformance()])
      .then(([s, t]) => { setSummary(s); setTechPerf(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-900 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Reports & Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={summary?.total ?? 0} />
        <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
        <StatCard label="Pending" value={summary?.pending ?? 0} color="bg-yellow-50" />
        <StatCard label="Escalated" value={summary?.escalated ?? 0} color="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Requests by Issue Type</h2>
          <div className="space-y-3">
            {(summary?.byIssueType || []).map(({ issueType, count }: any) => (
              <div key={issueType}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="dark:text-gray-300">{issueType}</span>
                  <span className="font-medium dark:text-gray-200">{count}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: summary.total > 0 ? `${(count / summary.total) * 100}%` : "0%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Technician Performance</h2>
          <table className="w-full text-sm">
            <thead className="text-gray-500 dark:text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left pb-2">Technician</th>
                <th className="text-left pb-2">Assigned</th>
                <th className="text-left pb-2">Fixed</th>
                <th className="text-left pb-2">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {techPerf.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-400">No data yet.</td></tr>}
              {techPerf.map((t) => (
                <tr key={t.id}>
                  <td className="py-2 dark:text-gray-300">{t.name}</td>
                  <td className="py-2 dark:text-gray-300">{t.assigned}</td>
                  <td className="py-2 dark:text-gray-300">{t.fixed}</td>
                  <td className="py-2 text-green-600 dark:text-green-400 font-medium">{t.fixRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-700">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Requests by Urgency</h2>
        <div className="flex gap-8">
          {(summary?.byUrgency || []).map(({ urgency, count }: any) => (
            <div key={urgency} className="text-center">
              <p className="text-4xl font-bold dark:text-white">{count}</p>
              <p className={`text-sm font-medium mt-1 ${urgency === "HIGH" ? "text-red-600 dark:text-red-400" : urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>
                {urgency}
              </p>
            </div>
          ))}
        </div>
        {summary?.avgFeedbackRating && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Avg Feedback Rating:{" "}
              <span className="font-bold text-yellow-500">
                {"★".repeat(Math.round(summary.avgFeedbackRating))} {summary.avgFeedbackRating.toFixed(1)}/5
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
