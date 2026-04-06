"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const statusCls: Record<string, string> = {
  ACTIVE:            "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  FAULTY:            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  RETIRED:           "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAsset, setEditAsset] = useState<any | null>(null);
  const [historyAsset, setHistoryAsset] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ type: "", model: "", serialNumber: "", location: "", status: "ACTIVE", notes: "" });
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchAssets = async () => {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      setAssets(await api.getAssets(params));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, [search]);

  const openHistory = async (a: any) => {
    setHistoryAsset(a);
    try { setHistory(await api.getAssetHistory(a.id)); }
    catch { setHistory([]); }
  };

  const saveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setActing(true); setError("");
    try {
      if (editAsset) {
        await api.updateAsset(editAsset.id, { type: form.type, model: form.model, location: form.location, status: form.status, notes: form.notes });
      } else {
        await api.createAsset(form);
      }
      setForm({ type: "", model: "", serialNumber: "", location: "", status: "ACTIVE", notes: "" });
      setShowForm(false); setEditAsset(null);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message || "Failed to save asset");
    } finally { setActing(false); }
  };

  const openEdit = (a: any) => {
    setEditAsset(a);
    setForm({ type: a.type, model: a.model, serialNumber: a.serialNumber, location: a.location, status: a.status, notes: a.notes || "" });
    setShowForm(true);
  };

  const filtered = assets.filter((a) =>
    !search ||
    a.assetNumber?.toLowerCase().includes(search.toLowerCase()) ||
    a.type?.toLowerCase().includes(search.toLowerCase()) ||
    a.model?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.toLowerCase().includes(search.toLowerCase()) ||
    a.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Asset Management</h1>
        <button onClick={() => { setEditAsset(null); setForm({ type: "", model: "", serialNumber: "", location: "", status: "ACTIVE", notes: "" }); setShowForm(true); }}
          className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">
          + Add Asset
        </button>
      </div>

      <input type="text" placeholder="Search by ID, type, model, location, serial..."
        value={search} onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm w-80 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Asset ID</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Serial No.</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No assets found.</td></tr>}
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono text-blue-700 dark:text-blue-400 text-xs">{a.assetNumber}</td>
                <td className="px-4 py-3 font-medium dark:text-gray-200">{a.type}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{a.model}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-gray-500">{a.serialNumber}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{a.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusCls[a.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => openEdit(a)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                  <button onClick={() => openHistory(a)} className="text-xs text-gray-500 dark:text-gray-400 hover:underline">History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{editAsset ? "Edit Asset" : "Add New Asset"}</h2>
            <form onSubmit={saveAsset} className="space-y-4">
              {[
                { label: "Type", key: "type", placeholder: "e.g. Laptop, Printer", disabled: false },
                { label: "Model", key: "model", placeholder: "e.g. Dell Latitude 5520", disabled: false },
                { label: "Serial Number", key: "serialNumber", placeholder: "e.g. DL5520-001", disabled: !!editAsset },
                { label: "Location", key: "location", placeholder: "e.g. Admin Block", disabled: false },
              ].map(({ label, key, placeholder, disabled }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input required={!disabled} disabled={disabled} value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ACTIVE">Active</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="FAULTY">Faulty</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={acting}
                  className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60">
                  {acting ? "Saving..." : editAsset ? "Save Changes" : "Add Asset"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditAsset(null); }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold dark:text-white">Maintenance History</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{historyAsset.assetNumber} — {historyAsset.model}</p>
              </div>
              <button onClick={() => setHistoryAsset(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
            </div>
            {history.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No history recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{h.action}</span>
                      <span className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</span>
                    </div>
                    {h.oldStatus && h.newStatus && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-red-500">{h.oldStatus.replace("_"," ")}</span>
                        {" → "}
                        <span className="text-green-500">{h.newStatus.replace("_"," ")}</span>
                      </p>
                    )}
                    {h.notes && <p className="text-xs text-gray-400 mt-1">{h.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">By: {h.user?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
