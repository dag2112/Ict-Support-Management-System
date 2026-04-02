"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { email: "abebe@woldia.edu.et",  password: "Abebe@1234",  role: "Requester" },
  { email: "tigist@woldia.edu.et", password: "Tigist@1234", role: "Approver" },
  { email: "yonas@woldia.edu.et",  password: "Yonas@1234",  role: "Technician" },
  { email: "meron@woldia.edu.et",  password: "Meron@1234",  role: "Manager" },
  { email: "dawit@woldia.edu.et",  password: "Dawit@1234",  role: "Store Keeper" },
  { email: "admin@woldia.edu.et",  password: "Admin@1234",  role: "Admin" },
];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-red-600 text-white px-5 py-4 rounded-xl shadow-2xl min-w-[320px] max-w-sm">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-white/70 hover:text-white text-xl leading-none ml-2">✕</button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setToast(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <Link href="/" className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">ICT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to ICT Support System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@woldia.edu.et" required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-3 dark:text-gray-300"></p>
          <ul className="space-y-2">
            {DEMO_ACCOUNTS.map(({ email: e, password: pw, role }) => (
              <li key={e} onClick={() => { setEmail(e); setPassword(pw); }}
                className="flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium">{e}</p>
                  <p className="text-gray-400 dark:text-gray-400">pw: {pw}</p>
                </div>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium whitespace-nowrap">{role}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-gray-400 text-center"></p>
        </div>
      </div>
    </div>
  );
}
