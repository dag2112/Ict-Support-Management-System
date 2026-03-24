"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-700",
  FAULTY: "bg-red-100 text-red-700",
  RETIRED: "bg-gray-100 text-gray-500",
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "", model: "", serialNumber: "", location: "", status: "ACTIVE" });
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const fetchAssets = async () => {
    try { setAssets(await api.getAssets()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, []);

  const addAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setActing(true); setError("");
    try {
      await api.createAsset(form);
      setForm({ type: "", model: "", serialNumber: "", location: "", status: "ACTIVE" });
      setShowForm(false);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message || "Failed to add asset");
    } finally { setActing(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">+ Add Asset</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Asset ID</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Serial No.</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {!loading && assets.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No assets found.</td></tr>}
            {assets.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-blue-700 text-xs">{a.assetNumber}</td>
                <td className="px-4 py-3 font-medium">{a.type}</td>
                <td className="px-4 py-3 text-gray-500">{a.model}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{a.serialNumber}</td>
                <td className="px-4 py-3 text-gray-500">{a.location}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] ?? "bg-gray-100 text-gray-700"}`}>{a.status.replace("_", " ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Add New Asset</h2>
            <form onSubmit={addAsset} className="space-y-4">
              {[
                { label: "Type", key: "type", placeholder: "e.g. Laptop, Printer" },
                { label: "Model", key: "model", placeholder: "e.g. Dell Latitude 5520" },
                { label: "Serial Number", key: "serialNumber", placeholder: "e.g. DL5520-001" },
                { label: "Location", key: "location", placeholder: "e.g. Admin Block" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input required value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ACTIVE">Active</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="FAULTY">Faulty</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={acting} className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60">
                  {acting ? "Adding..." : "Add Asset"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
