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

  const statusColor = (s: string) =>
    s === "APPROVED" ? "bg-green-100 text-green-700" :
    s === "ALLOCATED" ? "bg-teal-100 text-teal-700" :
    s === "PURCHASE_REQUESTED" ? "bg-gray-100 text-gray-700" :
    "bg-yellow-100 text-yellow-700";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Spare Part Requests</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Request</th>
              <th className="px-4 py-3 text-left">Spare Part</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Requested By</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && spares.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No spare requests.</td></tr>}
            {spares.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-700 text-xs">{s.request?.requestNumber}</td>
                <td className="px-4 py-3 font-medium">{s.spareName}</td>
                <td className="px-4 py-3">{s.quantity}</td>
                <td className="px-4 py-3 text-gray-500">{s.requestedBy?.name}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(s.status)}`}>{s.status.replace("_", " ")}</span></td>
                <td className="px-4 py-3">
                  {s.status === "PENDING" && (
                    <button onClick={() => approve(s.id)} disabled={acting === s.id}
                      className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 disabled:opacity-50">
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
