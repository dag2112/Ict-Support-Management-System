"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function StorePage() {
  const [spares, setSpares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

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

  const statusColor = (s: string) =>
    s === "ALLOCATED" ? "bg-teal-100 text-teal-700" :
    s === "PURCHASE_REQUESTED" ? "bg-gray-100 text-gray-700" :
    s === "APPROVED" ? "bg-green-100 text-green-700" :
    "bg-yellow-100 text-yellow-700";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Spare Part Requests</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      <div className="space-y-4">
        {!loading && spares.length === 0 && <p className="text-gray-400">No spare requests.</p>}
        {spares.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-blue-700 text-xs">{s.request?.requestNumber}</span>
              </div>
              <p className="font-semibold text-gray-800">{s.spareName}</p>
              <p className="text-sm text-gray-500">Qty: {s.quantity} · Requested by: {s.requestedBy?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(s.status)}`}>{s.status.replace("_", " ")}</span>
              {s.status === "APPROVED" && (
                <>
                  <button onClick={() => allocate(s.id)} disabled={acting === s.id}
                    className="text-sm bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full hover:bg-teal-200 disabled:opacity-50">
                    {acting === s.id ? "..." : "Allocate"}
                  </button>
                  <button onClick={() => requestPurchase(s.id)} disabled={acting === s.id}
                    className="text-sm bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50">
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
