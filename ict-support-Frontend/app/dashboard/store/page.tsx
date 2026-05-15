"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const statusCls = (s: string) =>
  s === "ALLOCATED"          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" :
  s === "PURCHASE_REQUESTED" ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
  s === "APPROVED"           ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" :
                               "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

export default function StorePage() {
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("APPROVED");

  const fetchSpares = async () => {
    try { setSpares(await api.getSpares()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSpares(); }, []);

  const allocate = async (id: string) => {
    setActing(id);
    try { await api.allocateSpare(id); await fetchSpares(); }
    catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const requestPurchase = async (id: string) => {
    setActing(id);
    try { await api.purchaseSpare(id); await fetchSpares(); }
    catch (e) { console.error(e); }
    finally { setActing(null); }
  };

  const filtered = spares.filter((s) => {
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    const matchSearch = !search ||
      s.spareName?.toLowerCase().includes(search.toLowerCase()) ||
      s.request?.requestNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.requestedBy?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Spare Parts Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pending",           status: "PENDING",           color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" },
          { label: "Approved",          status: "APPROVED",          color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" },
          { label: "Allocated",         status: "ALLOCATED",         color: "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300" },
          { label: "Purchase Requested",status: "PURCHASE_REQUESTED",color: "bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300" },
        ].map(({ label, status, color }) => (
          <div key={status} className={`rounded-xl p-4 border border-gray-100 dark:border-gray-700 ${color}`}>
            <p className="text-xs font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">{spares.filter((s) => s.status === status).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input type="text" placeholder="Search spare name, request, technician..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-2">
          {["APPROVED", "PENDING", "ALLOCATED", "PURCHASE_REQUESTED", "ALL"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s
                  ? "bg-blue-900 text-white dark:bg-blue-700"
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}>
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="space-y-3">
        {!loading && filtered.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-400 border border-gray-100 dark:border-gray-700">
            No spare requests found.
          </div>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 dark:border-gray-700">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-blue-700 dark:text-blue-400 text-xs">{s.request?.requestNumber}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">→ {s.request?.title}</span>
              </div>
              <p className="font-semibold text-gray-800 dark:text-white">{s.spareName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Qty: {s.quantity} · Requested by: {s.requestedBy?.name} · {new Date(s.createdAt).toLocaleDateString()}
              </p>
              {s.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.description}</p>}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusCls(s.status)}`}>
                {s.status.replace("_", " ")}
              </span>
              {s.status === "APPROVED" && (
                <>
                  <button onClick={() => allocate(s.id)} disabled={acting === s.id}
                    className="text-sm bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-4 py-1.5 rounded-full hover:bg-teal-200 disabled:opacity-50 transition-colors">
                    {acting === s.id ? "..." : "Allocate"}
                  </button>
                  <button onClick={() => requestPurchase(s.id)} disabled={acting === s.id}
                    className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors">
                    Request Purchase
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
