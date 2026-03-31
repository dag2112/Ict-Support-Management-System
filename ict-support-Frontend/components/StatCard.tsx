interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export default function StatCard({ label, value, color = "bg-white dark:bg-gray-800" }: StatCardProps) {
  return (
    <div className={`${color} dark:bg-gray-800 rounded-xl shadow p-5 flex flex-col gap-1 border border-gray-100 dark:border-gray-700`}>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}
