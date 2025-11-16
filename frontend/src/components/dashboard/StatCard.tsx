export default function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl" style={{ color }}>{icon}</div>
        <div>
          <p className="text-gray-600">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}

