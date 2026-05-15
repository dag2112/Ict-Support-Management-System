"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const statusCls = (s: string) =>
  s === "APPROVED"           ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
  s === "ALLOCATED"          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" :
  s === "PURCHASE_REQUESTED" ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
                               "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

export default function SparesPage() {
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchSpares = async () => {
    try { setSpares(await api.getSpares()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSpares(); }, []);

  const approve = async (id: string) => {
    setActing(id);
    try { await api.approveSpare(id); await fetchSpares(); }
    catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const filtered = spares.filter((s) =>
    !search ||
    s.spareName?.toLowerCase().includes(search.toLowerCase()) ||
    s.request?.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.requestedBy?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const pending  = spares.filter((s) => s.status === "PENDING").length;
  const approved = spares.filter((s) => s.status === "APPROVED").length;
  const allocated = spares.filter((s) => s.status === "ALLOCATED").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Spare Part Requests</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mt-1">{pending}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200 mt-1">{approved}</p>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-800">
          <p className="text-sm text-teal-700 dark:text-teal-300">Allocated</p>
          <p className="text-3xl font-bold text-teal-800 dark:text-teal-200 mt-1">{allocated}</p>
        </div>
      </div>

      {/* Search */}
      <input type="text" placeholder="Search by spare name, request ID, technician..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-80 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Request</th>
              <th className="px-4 py-3 text-left">Spare Part</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Requested By</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No spare requests found.</td></tr>}
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{s.request?.requestNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">{s.spareName}</td>
                <td className="px-4 py-3 dark:text-gray-300">{s.quantity}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{s.requestedBy?.name}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusCls(s.status)}`}>
                    {s.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {s.status === "PENDING" && (
                    <button onClick={() => approve(s.id)} disabled={acting === s.id}
                      className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 disabled:opacity-50">
                      {acting === s.id ? "..." : "Approve"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
