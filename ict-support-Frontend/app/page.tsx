"use client";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-900 font-bold text-sm">ICT</span>
          </div>
          <span className="font-bold text-lg tracking-tight">ICT Support System</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => router.push("/login")}
            className="bg-white text-blue-900 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm">
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-block bg-white/10 border border-white/20 text-blue-200 text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Woldia University — ICT Directorate
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-6">
          ICT Support &<br />Management Platform
        </h1>
        <p className="text-blue-200 text-lg max-w-xl mb-10 leading-relaxed">
          A centralized platform to submit, track, and resolve ICT support requests efficiently.
          Replacing paper-based processes with a modern, automated solution.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg"
          >
            Get Started →
          </button>
          <a
            href="#features"
            className="border border-white/30 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border-t border-b border-white/10">
        {[
          { value: "6", label: "User Roles" },
          { value: "15+", label: "Features" },
          { value: "100%", label: "Digital" },
          { value: "24/7", label: "Accessible" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-blue-900/50 text-center py-8 px-4">
            <p className="text-4xl font-extrabold text-white">{value}</p>
            <p className="text-blue-300 text-sm mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📋", title: "Request Submission", desc: "Submit ICT support requests electronically with issue type, urgency, and location details." },
            { icon: "✅", title: "Approval Workflow", desc: "Approvers review and approve or reject requests with required justification." },
            { icon: "🔧", title: "Technician Assignment", desc: "Managers assign approved requests to available technicians instantly." },
            { icon: "🔩", title: "Spare Parts Management", desc: "Technicians request spare parts; managers approve and storekeepers allocate." },
            { icon: "📊", title: "Reports & Analytics", desc: "Managers get real-time reports on request volume, technician performance, and trends." },
            { icon: "🔔", title: "Notifications", desc: "Automated in-app notifications keep all stakeholders informed at every step." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-blue-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-6 bg-white/5 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Built for every role</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { role: "Requester", color: "bg-blue-500/20 border-blue-400/30 text-blue-200" },
              { role: "Approver", color: "bg-green-500/20 border-green-400/30 text-green-200" },
              { role: "Technician", color: "bg-purple-500/20 border-purple-400/30 text-purple-200" },
              { role: "Manager", color: "bg-orange-500/20 border-orange-400/30 text-orange-200" },
              { role: "Store Keeper", color: "bg-teal-500/20 border-teal-400/30 text-teal-200" },
              { role: "Admin", color: "bg-red-500/20 border-red-400/30 text-red-200" },
            ].map(({ role, color }) => (
              <span key={role} className={`border px-5 py-2 rounded-full text-sm font-medium ${color}`}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-blue-300 mb-8">Log in with your university credentials to access the platform.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-blue-900 font-bold px-10 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
        >
          Login to the System
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-blue-400 text-xs px-6">
        © 2026 Woldia University — ICT Support Management System. Developed by Group 4, Software Engineering.
      </footer>
    </div>
  );
}
