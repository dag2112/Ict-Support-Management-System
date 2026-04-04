const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<any>("/auth/me"),
  changePassword: (currentPassword: string, newPassword: string) =>
    request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Requests
  getRequests: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/requests${qs}`);
  },
  getRequest: (id: string) => request<any>(`/requests/${id}`),
  createRequest: (data: any) =>
    request<any>("/requests", { method: "POST", body: JSON.stringify(data) }),
  approveRequest: (id: string) =>
    request<any>(`/requests/${id}/approve`, { method: "PUT" }),
  rejectRequest: (id: string, rejectionReason: string) =>
    request<any>(`/requests/${id}/reject`, { method: "PUT", body: JSON.stringify({ rejectionReason }) }),
  assignRequest: (id: string, technicianId: string) =>
    request<any>(`/requests/${id}/assign`, { method: "PUT", body: JSON.stringify({ technicianId }) }),
  updateRequestStatus: (id: string, status: string, resolutionNote?: string) =>
    request<any>(`/requests/${id}/status`, { method: "PUT", body: JSON.stringify({ status, resolutionNote }) }),
  escalateRequest: (id: string) =>
    request<any>(`/requests/${id}/escalate`, { method: "PUT" }),

  // Users
  getUsers: () => request<any[]>("/users"),
  getTechnicians: () => request<any[]>("/users/technicians"),
  createUser: (data: any) =>
    request<any>("/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) =>
    request<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: string) =>
    request<any>(`/users/${id}`, { method: "DELETE" }),

  // Feedback
  submitFeedback: (data: any) =>
    request<any>("/feedback", { method: "POST", body: JSON.stringify(data) }),
  getFeedback: () => request<any[]>("/feedback"),

  // Assets
  getAssets: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any[]>(`/assets${qs}`);
  },
  createAsset: (data: any) =>
    request<any>("/assets", { method: "POST", body: JSON.stringify(data) }),
  updateAsset: (id: string, data: any) =>
    request<any>(`/assets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAsset: (id: string) =>
    request<any>(`/assets/${id}`, { method: "DELETE" }),

  // Chat
  getChatMessages: (requestId: string) => request<any[]>(`/chat/${requestId}`),
  sendChatMessage: (requestId: string, message: string) =>
    request<any>(`/chat/${requestId}`, { method: "POST", body: JSON.stringify({ message }) }),
  getNotifications: () => request<any[]>("/notifications"),
  markRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () =>
    request<any>("/notifications/read-all", { method: "PUT" }),

  // Reports
  getReportSummary: () => request<any>("/reports/summary"),
  getTechnicianPerformance: () => request<any[]>("/reports/technician-performance"),
  getAuditLogs: () => request<any[]>("/reports/audit-logs"),
};
