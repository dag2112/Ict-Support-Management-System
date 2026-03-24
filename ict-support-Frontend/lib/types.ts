export type Role = "requester" | "approver" | "technician" | "manager" | "storekeeper" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type RequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Assigned"
  | "Fixed"
  | "Escalated"
  | "Need Spare"
  | "Spare Allocated"
  | "Purchase Requested";

export interface SupportRequest {
  id: string;
  title: string;
  description: string;
  issueType: string;
  urgency: "Low" | "Medium" | "High";
  status: RequestStatus;
  submittedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  resolutionNote?: string;
  feedback?: { rating: number; comment: string };
}

export interface SpareRequest {
  id: string;
  requestId: string;
  spareName: string;
  quantity: number;
  status: "Pending" | "Approved" | "Allocated" | "Purchase Requested";
  requestedBy: string;
}

export interface Asset {
  id: string;
  type: string;
  model: string;
  serialNumber: string;
  location: string;
  status: "Active" | "Under Maintenance" | "Faulty" | "Retired";
}
