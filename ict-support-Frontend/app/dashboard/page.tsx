"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const reqRes = await api.getRequests();
        setRequests(reqRes.requests || []);
        if (user.role === "MANAGER" || user.role === "ADMIN") {
          const sum = await api.getReportSummary();
          setSummary(sum);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  if (!user || loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-900 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user.role === "REQUESTER") return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Welcome, {user.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={requests.length} />
        <StatCard label="Pending" value={requests.filter(r => r.status === "PENDING").length} color="bg-yellow-50" />
        <StatCard label="In Progress" value={requests.filter(r => r.status === "ASSIGNED").length} color="bg-blue-50" />
        <StatCard label="Fixed" value={requests.filter(r => r.status === "FIXED").length} color="bg-green-50" />
      </div>
      <div className="flex gap-4 mb-8">
        <Link href="/dashboard/submit" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">+ Submit Request</Link>
        <Link href="/dashboard/requests" className="border border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 px-5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium">View My Requests</Link>
      </div>
      <RecentRequests requests={requests.slice(0, 5)} />
    </div>
  );

  if (user.role === "TECHNICIAN") return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Technician Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Assigned Tasks" value={requests.length} color="bg-blue-50" />
        <StatCard label="Fixed" value={requests.filter(r => r.status === "FIXED").length} color="bg-green-50" />
        <StatCard label="Escalated" value={requests.filter(r => r.status === "ESCALATED").length} color="bg-orange-50" />
      </div>
      <Link href="/dashboard/tasks" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">View Assigned Tasks</Link>
      <div className="mt-8"><RecentRequests requests={requests.slice(0, 5)} /></div>
    </div>
  );

  if (user.role === "MANAGER") return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Manager Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={summary?.total ?? 0} />
        <StatCard label="Pending Approval" value={summary?.pending ?? 0} color="bg-yellow-50" />
        <StatCard label="Assigned" value={summary?.assigned ?? 0} color="bg-blue-50" />
        <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
      </div>
      <div className="flex gap-4 mb-8">
        <Link href="/dashboard/approve" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Review Requests</Link>
        <Link href="/dashboard/assign" className="border border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 px-5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium">Assign Technician</Link>
        <Link href="/dashboard/reports" className="border border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 px-5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium">View Reports</Link>
      </div>
      <RecentRequests requests={requests.slice(0, 5)} />
    </div>
  );

  if (user.role === "STOREKEEPER") return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Store Keeper Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Manage ICT assets and equipment inventory.</p>
      <Link href="/dashboard/assets" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Manage Assets</Link>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={summary?.total ?? 0} />
        <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
        <StatCard label="Pending" value={summary?.pending ?? 0} color="bg-yellow-50" />
        <StatCard label="Escalated" value={summary?.escalated ?? 0} color="bg-orange-50" />
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/users" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Manage Users</Link>
        <Link href="/dashboard/assets" className="border border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 px-5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium">Manage Assets</Link>
      </div>
    </div>
  );
}

function RecentRequests({ requests }: { requests: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 dark:text-white">Recent Requests</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {requests.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No requests found.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3 dark:text-gray-200">{r.title}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.issueType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600 dark:text-red-400" : r.urgency === "MEDIUM" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"}`}>{r.urgency}</span></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
