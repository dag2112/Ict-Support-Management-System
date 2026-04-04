const colors: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  APPROVED:   "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  REJECTED:   "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  ASSIGNED:   "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  FIXED:      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  ESCALATED:  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  NEED_SPARE: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

const labels: Record<string, string> = {
  PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected",
  ASSIGNED: "Assigned", FIXED: "Fixed", ESCALATED: "Escalated",
  NEED_SPARE: "Need Spare",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
      {labels[status] ?? status}
    </span>
  );
}
