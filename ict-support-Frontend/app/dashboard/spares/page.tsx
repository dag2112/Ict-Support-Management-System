"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function SparesPage() {
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

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

  const statusCls = (s: string) =>
    s === "APPROVED" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
    s === "ALLOCATED" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" :
    s === "PURCHASE_REQUESTED" ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Spare Part Requests</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Request</th>
              <th className="px-4 py-3 text-left">Spare Part</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Requested By</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && spares.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No spare requests.</td></tr>}
            {spares.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{s.request?.requestNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">{s.spareName}</td>
                <td className="px-4 py-3 dark:text-gray-300">{s.quantity}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{s.requestedBy?.name}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusCls(s.status)}`}>{s.status.replace("_", " ")}</span></td>
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
