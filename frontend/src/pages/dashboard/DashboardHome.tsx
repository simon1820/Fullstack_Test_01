import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StatCard from "../../components/dashboard/StatCard";
import DashboardFilters from "../../components/dashboard/Filters";
import HistoryChart from "../../components/dashboard/HistoryChart";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { getStats } from "../../api/stats.api";
import { getProjects } from "../../api/projects.api";

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState([]);

  const [filter, setFilter] = useState<any>({
    projectId: "",
    range: "7",
    from: "",
    to: "",
  });

  // ==========================
  // CARGAR PROYECTOS
  // ==========================
  useEffect(() => {
    (async () => {
      try {
        const proj = await getProjects();
        setProjects(proj.data);
      } catch {
        toast.error("Error cargando proyectos");
      }
    })();
  }, []);

  // ==========================
  // CARGAR ESTADÍSTICAS
  // ==========================
  useEffect(() => {
    (async () => {
      try {
        const res = await getStats(filter);
        setStats(res.data);
      } catch {
        toast.error("Error cargando estadísticas");
      }
    })();
  }, [filter]);

  if (!stats) {
    return <p className="text-gray-500 text-lg animate-pulse">Cargando Dashboard...</p>;
  }

  // ==========================
  // DATA PARA GRÁFICOS
  // ==========================
  const estados = stats.estados;
  const prioridades = stats.prioridades;
  const historial = stats.historial;

  const COLORS = ["#fbbf24", "#3b82f6", "#10b981"];

  return (
    <div className="space-y-10">

      {/* TITULO */}
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        Dashboard
      </h1>

      {/* FILTROS */}
      <DashboardFilters
        projects={projects}
        filter={filter}
        setFilter={setFilter}
      />

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Proyectos"
          value={stats.totalProjects}
          icon={<i className="bi bi-kanban" />}
          color="#2563eb"
        />

        <StatCard
          title="Tareas Totales"
          value={stats.totalTasks}
          icon={<i className="bi bi-list-task" />}
          color="#16a34a"
        />

        <StatCard
          title="Completadas"
          value={stats.completed}
          icon={<i className="bi bi-check-circle" />}
          color="#10b981"
        />

        <StatCard
          title="En progreso"
          value={stats.inProgress}
          icon={<i className="bi bi-hourglass-split" />}
          color="#7c3aed"
        />
      </div>

      {/* PIE CHART */}
      <div className="bg-white shadow-xl p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Distribución de Estados</h3>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={estados} dataKey="value" nameKey="name" outerRadius={120} label>
                {estados.map((_: any, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-white shadow-xl p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Prioridades</h3>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={prioridades}>
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HISTORIAL */}
      <HistoryChart data={historial} />
    </div>
  );
}
