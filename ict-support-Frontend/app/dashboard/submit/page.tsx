"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SubmitRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", issueType: "Hardware", urgency: "MEDIUM", location: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.createRequest(form);
      setSubmitted(true);
      setTimeout(() => router.push("/dashboard/requests"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Request Submitted!</h2>
          <p className="text-gray-500 text-sm mt-1">Your request has been sent for approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Submit ICT Support Request</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief title of the issue"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
              <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Hardware</option><option>Software</option><option>Network</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Admin Block, Lab 1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-500">
            Status: <span className="font-medium text-yellow-600">Pending</span> &nbsp;|&nbsp; Submitted by: <span className="font-medium">{user?.name}</span>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <button type="button" onClick={() => router.back()} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
