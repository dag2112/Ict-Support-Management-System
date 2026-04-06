"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.changePassword(form.currentPassword, form.newPassword);
      setSuccess("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    REQUESTER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    APPROVER: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    TECHNICIAN: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    MANAGER: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    STOREKEEPER: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-900 dark:bg-blue-700 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user?.role ?? ""] ?? "bg-gray-100 text-gray-700"}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-xs uppercase font-medium mb-1">Department</p>
            <p className="text-gray-700 dark:text-gray-300">{(user as any)?.department || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 dark:text-gray-500 text-xs uppercase font-medium mb-1">Role</p>
            <p className="text-gray-700 dark:text-gray-300 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Current Password", key: "currentPassword" },
            { label: "New Password", key: "newPassword" },
            { label: "Confirm New Password", key: "confirmPassword" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type="password"
                required
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder="••••••••"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg px-4 py-3 text-sm">
              ✓ {success}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60 transition-colors">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
