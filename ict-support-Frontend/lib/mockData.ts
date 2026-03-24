import { User, SupportRequest, SpareRequest, Asset } from "./types";

export const mockUsers: User[] = [
  { id: "1", name: "Abebe Kebede", email: "abebe@woldia.edu.et", role: "requester" },
  { id: "2", name: "Tigist Haile", email: "tigist@woldia.edu.et", role: "approver" },
  { id: "3", name: "Yonas Tesfaye", email: "yonas@woldia.edu.et", role: "technician" },
  { id: "4", name: "Meron Alemu", email: "meron@woldia.edu.et", role: "manager" },
  { id: "5", name: "Dawit Girma", email: "dawit@woldia.edu.et", role: "storekeeper" },
  { id: "6", name: "Admin User", email: "admin@woldia.edu.et", role: "admin" },
];

export const mockRequests: SupportRequest[] = [
  {
    id: "REQ-001",
    title: "Laptop screen not working",
    description: "The screen flickers and goes black after 5 minutes of use.",
    issueType: "Hardware",
    urgency: "High",
    status: "Assigned",
    submittedBy: "Abebe Kebede",
    assignedTo: "Yonas Tesfaye",
    createdAt: "2026-03-15T09:00:00Z",
    updatedAt: "2026-03-16T10:00:00Z",
  },
  {
    id: "REQ-002",
    title: "Cannot connect to university WiFi",
    description: "Getting authentication error when connecting to campus network.",
    issueType: "Network",
    urgency: "Medium",
    status: "Pending",
    submittedBy: "Abebe Kebede",
    createdAt: "2026-03-17T08:30:00Z",
    updatedAt: "2026-03-17T08:30:00Z",
  },
  {
    id: "REQ-003",
    title: "Printer not printing",
    description: "Office printer shows offline status.",
    issueType: "Hardware",
    urgency: "Low",
    status: "Fixed",
    submittedBy: "Abebe Kebede",
    assignedTo: "Yonas Tesfaye",
    createdAt: "2026-03-10T11:00:00Z",
    updatedAt: "2026-03-12T14:00:00Z",
    resolutionNote: "Replaced printer cable and updated driver.",
  },
  {
    id: "REQ-004",
    title: "Software installation request",
    description: "Need MATLAB installed on lab computers.",
    issueType: "Software",
    urgency: "Medium",
    status: "Approved",
    submittedBy: "Abebe Kebede",
    createdAt: "2026-03-18T07:00:00Z",
    updatedAt: "2026-03-18T12:00:00Z",
  },
];

export const mockSpareRequests: SpareRequest[] = [
  {
    id: "SPR-001",
    requestId: "REQ-001",
    spareName: "Laptop Screen 15.6 inch",
    quantity: 1,
    status: "Pending",
    requestedBy: "Yonas Tesfaye",
  },
];

export const mockAssets: Asset[] = [
  { id: "AST-001", type: "Laptop", model: "Dell Latitude 5520", serialNumber: "DL5520-001", location: "Admin Block", status: "Active" },
  { id: "AST-002", type: "Printer", model: "HP LaserJet Pro", serialNumber: "HPLJ-002", location: "Library", status: "Under Maintenance" },
  { id: "AST-003", type: "Server", model: "Dell PowerEdge R740", serialNumber: "DPER740-001", location: "Server Room", status: "Active" },
  { id: "AST-004", type: "Desktop", model: "HP EliteDesk 800", serialNumber: "HPED-004", location: "Lab 1", status: "Faulty" },
];
