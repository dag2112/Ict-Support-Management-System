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
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [reqRes] = await Promise.all([api.getRequests()]);
        setRequests(reqRes.requests || []);

        if (user.role === "MANAGER" || user.role === "ADMIN") {
          const [sum, sp] = await Promise.all([api.getReportSummary(), api.getSpares()]);
          setSummary(sum);
          setSpares(sp);
        }
        if (user.role === "STOREKEEPER") {
          const sp = await api.getSpares();
          setSpares(sp);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user || loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" /></div>;

  if (user.role === "REQUESTER") {
    const mine = requests;
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Requests" value={mine.length} />
          <StatCard label="Pending" value={mine.filter((r) => r.status === "PENDING").length} color="bg-yellow-50" />
          <StatCard label="In Progress" value={mine.filter((r) => r.status === "ASSIGNED").length} color="bg-blue-50" />
          <StatCard label="Fixed" value={mine.filter((r) => r.status === "FIXED").length} color="bg-green-50" />
        </div>
        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/submit" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">+ Submit Request</Link>
          <Link href="/dashboard/requests" className="border border-blue-900 text-blue-900 px-5 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium">View My Requests</Link>
        </div>
        <RecentRequests requests={mine.slice(0, 5)} />
      </div>
    );
  }

  if (user.role === "APPROVER") {
    const pending = requests.filter((r) => r.status === "PENDING");
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Approver Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Pending Approval" value={pending.length} color="bg-yellow-50" />
          <StatCard label="Approved" value={requests.filter((r) => r.status === "APPROVED").length} color="bg-green-50" />
          <StatCard label="Rejected" value={requests.filter((r) => r.status === "REJECTED").length} color="bg-red-50" />
        </div>
        <Link href="/dashboard/approve" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Review Pending Requests</Link>
        <div className="mt-8"><RecentRequests requests={pending.slice(0, 5)} /></div>
      </div>
    );
  }

  if (user.role === "TECHNICIAN") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Technician Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Assigned Tasks" value={requests.length} color="bg-blue-50" />
          <StatCard label="Fixed" value={requests.filter((r) => r.status === "FIXED").length} color="bg-green-50" />
          <StatCard label="Escalated" value={requests.filter((r) => r.status === "ESCALATED").length} color="bg-orange-50" />
        </div>
        <Link href="/dashboard/tasks" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">View Assigned Tasks</Link>
        <div className="mt-8"><RecentRequests requests={requests.slice(0, 5)} /></div>
      </div>
    );
  }

  if (user.role === "MANAGER") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Requests" value={summary?.total ?? 0} />
          <StatCard label="Pending Assignment" value={summary?.approved ?? 0} color="bg-yellow-50" />
          <StatCard label="Spare Requests" value={spares.length} color="bg-purple-50" />
          <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
        </div>
        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/assign" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Assign Technician</Link>
          <Link href="/dashboard/reports" className="border border-blue-900 text-blue-900 px-5 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium">View Reports</Link>
        </div>
        <RecentRequests requests={requests.slice(0, 5)} />
      </div>
    );
  }

  if (user.role === "STOREKEEPER") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Store Keeper Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Spare Requests" value={spares.length} />
          <StatCard label="Pending" value={spares.filter((s) => s.status === "PENDING").length} color="bg-yellow-50" />
          <StatCard label="Allocated" value={spares.filter((s) => s.status === "ALLOCATED").length} color="bg-green-50" />
        </div>
        <Link href="/dashboard/store" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Manage Spare Requests</Link>
      </div>
    );
  }

  // ADMIN
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Requests" value={summary?.total ?? 0} />
        <StatCard label="Fixed" value={summary?.fixed ?? 0} color="bg-green-50" />
        <StatCard label="Pending" value={summary?.pending ?? 0} color="bg-yellow-50" />
        <StatCard label="Escalated" value={summary?.escalated ?? 0} color="bg-orange-50" />
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard/users" className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">Manage Users</Link>
        <Link href="/dashboard/assets" className="border border-blue-900 text-blue-900 px-5 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium">Manage Assets</Link>
      </div>
    </div>
  );
}

function RecentRequests({ requests }: { requests: any[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Recent Requests</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Urgency</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No requests found.</td></tr>}
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-700 text-xs">{r.requestNumber}</td>
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3 text-gray-500">{r.issueType}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${r.urgency === "HIGH" ? "text-red-600" : r.urgency === "MEDIUM" ? "text-yellow-600" : "text-green-600"}`}>{r.urgency}</span></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
