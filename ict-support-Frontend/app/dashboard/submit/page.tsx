"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SubmitRequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "", description: "", issueType: "Hardware", urgency: "MEDIUM", location: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;
    const arr = Array.from(selected).slice(0, 3);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("issueType", form.issueType);
      fd.append("urgency", form.urgency);
      fd.append("location", form.location);
      files.forEach((f) => fd.append("attachments", f));

      const res = await fetch(`${API}/requests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
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
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your request has been sent for approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Submit ICT Support Request</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Request Title</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Brief title of the issue"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea required rows={4} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Type + Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Type</label>
              <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Hardware</option><option>Software</option><option>Network</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urgency</label>
              <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input type="text" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Admin Block, Lab 1"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Photo Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attach Photos <span className="text-gray-400 font-normal">(optional, max 3 images, 5MB each)</span>
            </label>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
            >
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click to upload or drag & drop photos here
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, GIF, WEBP up to 5MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`attachment-${i}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate w-24">
                      {files[i]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            Status: <span className="font-medium text-yellow-600 dark:text-yellow-400">Pending</span>
            &nbsp;|&nbsp; Submitted by: <span className="font-medium dark:text-gray-300">{user?.name}</span>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 text-sm font-medium disabled:opacity-60 transition-colors">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="border border-gray-300 dark:border-gray-600 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
