interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
}

export default function StatCard({ label, value, color = "bg-white" }: StatCardProps) {
  return (
    <div className={`${color} rounded-xl shadow p-5 flex flex-col gap-1`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
