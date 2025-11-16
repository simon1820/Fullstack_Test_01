export default function DashboardFilters({ projects, filter, setFilter }: any) {
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="flex flex-wrap gap-4 bg-white shadow-md p-4 rounded-xl mb-6">

      {/* PROYECTO */}
      <select
        className="border p-2 rounded"
        value={filter.projectId}
        onChange={(e) =>
          setFilter({ ...filter, projectId: Number(e.target.value) })
        }
      >
        <option value="">Todos los proyectos</option>

        {safeProjects.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* RANGO */}
      <select
        className="border p-2 rounded"
        value={filter.range}
        onChange={(e) => setFilter({ ...filter, range: e.target.value })}
      >
        <option value="7">Últimos 7 días</option>
        <option value="30">Últimos 30 días</option>
        <option value="90">Últimos 90 días</option>
        <option value="custom">Personalizado</option>
      </select>

      {/* FECHAS PERSONALIZADAS */}
      {filter.range === "custom" && (
        <>
          <input
            type="date"
            className="border p-2 rounded"
            value={filter.from}
            onChange={(e) => setFilter({ ...filter, from: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={filter.to}
            onChange={(e) => setFilter({ ...filter, to: e.target.value })}
          />
        </>
      )}
    </div>
  );
}
