"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const roleColors: Record<string, string> = {
  REQUESTER:  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  APPROVER:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  TECHNICIAN: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  MANAGER:    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  STOREKEEPER:"bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  ADMIN:      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "REQUESTER", department: "" });
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try { setUsers(await api.getUsers()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActing(true); setError("");
    try {
      await api.createUser(form);
      setForm({ name: "", email: "", password: "", role: "REQUESTER", department: "" });
      setShowForm(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally { setActing(false); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Deactivate this user?")) return;
    try { await api.deleteUser(id); await fetchUsers(); }
    catch (e) { console.error(e); }
  };

  const inputCls = "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Manage Users</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium">+ Add User</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>}
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium dark:text-gray-200">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role] ?? "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.department ?? "—"}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${u.isActive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3">
                  {u.isActive && <button onClick={() => deleteUser(u.id)} className="text-xs text-red-500 hover:text-red-700 dark:text-red-400">Deactivate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Add New User</h2>
            <form onSubmit={addUser} className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Password", key: "password", type: "password" },
                { label: "Department (optional)", key: "department", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                  <input required={key !== "department"} type={type} value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                  <option value="REQUESTER">Requester</option>
                  <option value="APPROVER">Approver</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STOREKEEPER">Store Keeper</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={acting} className="flex-1 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60">
                  {acting ? "Adding..." : "Add User"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 dark:border-gray-600 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
