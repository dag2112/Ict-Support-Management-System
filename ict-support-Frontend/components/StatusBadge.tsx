const colors: Record<string, string> = {
  // Backend enums
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  FIXED: "bg-emerald-100 text-emerald-800",
  ESCALATED: "bg-orange-100 text-orange-800",
  NEED_SPARE: "bg-purple-100 text-purple-800",
  SPARE_ALLOCATED: "bg-teal-100 text-teal-800",
  PURCHASE_REQUESTED: "bg-gray-100 text-gray-800",
};

const labels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ASSIGNED: "Assigned",
  FIXED: "Fixed",
  ESCALATED: "Escalated",
  NEED_SPARE: "Need Spare",
  SPARE_ALLOCATED: "Spare Allocated",
  PURCHASE_REQUESTED: "Purchase Requested",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-700"}`}>
      {labels[status] ?? status}
    </span>
  );
}
