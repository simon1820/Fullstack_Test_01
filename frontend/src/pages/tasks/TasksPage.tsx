import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../api/tasks.api";

import { getProjects } from "../../api/projects.api";
import EditTaskModal from "../../components/tasks/EditTaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [projectId, setProjectId] = useState<number | null>(null);

  const [editingTask, setEditingTask] = useState<any | null>(null);

  // ==========================
  // CARGAR DATOS
  // ==========================
  const loadData = async () => {
    try {
      const proj = await getProjects();
      const t = await getTasks();

      setProjects(proj.data);
      setTasks(t.data);

      if (!projectId && proj.data.length > 0) {
        setProjectId(proj.data[0].id);
      }
    } catch {
      toast.error("Error cargando tareas o proyectos");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================
  // CREAR TAREA
  // ==========================
  const handleCreate = async (e: any) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("La tarea necesita un título");
    if (!projectId) return toast.error("Selecciona un proyecto");

    const loading = toast.loading("Creando tarea...");

    try {
      await createTask({ title, description, priority, projectId });

      toast.success("Tarea creada", { id: loading });

      setTitle("");
      setDescription("");
      setPriority("media");

      loadData();
    } catch {
      toast.error("Error al crear tarea", { id: loading });
    }
  };

  // ==========================
  // GUARDAR EDICIÓN DE TAREA
  // ==========================
  const handleEditSave = async (data: any) => {
    const loading = toast.loading("Actualizando tarea...");

    try {
      await updateTask(editingTask.id, data);

      toast.success("Tarea actualizada", { id: loading });

      setEditingTask(null);
      loadData();
    } catch {
      toast.error("No se pudo editar la tarea", { id: loading });
    }
  };

  // ==========================
  // COMPLETAR TAREA
  // ==========================
  async function handleComplete(id: number) {
    const loading = toast.loading("Marcando como completada...");

    try {
      await updateTaskStatus(id, "completada");
      toast.success("Tarea completada", { id: loading });
      loadData();
    } catch {
      toast.error("No se pudo completar", { id: loading });
    }
  }

  // ==========================
  // ELIMINAR TAREA (TOAST CONFIRM)
  // ==========================
  function handleDelete(id: number) {
    toast(
      (t) => (
        <span className="flex items-center">
          ¿Eliminar tarea?
          <button
            className="ml-3 bg-red-600 text-white px-2 py-1 rounded text-xs"
            onClick={async () => {
              const loading = toast.loading("Eliminando...");

              await deleteTask(id);

              toast.dismiss(t.id);
              toast.success("Tarea eliminada", { id: loading });
              loadData();
            }}
          >
            Sí
          </button>
        </span>
      ),
      { duration: 4000 }
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tareas</h1>

      {/* ==========================
          FORM CREAR
      =========================== */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <form onSubmit={handleCreate}>
          <input
            className="border p-2 rounded w-full mb-4"
            placeholder="Tarea..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full mb-4"
            placeholder="Descripción..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full mb-4"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            className="border p-2 rounded w-full mb-4"
            value={projectId ?? ""}
            onChange={(e) => setProjectId(Number(e.target.value))}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Crear
          </button>
        </form>
      </div>

      {/* ==========================
          LISTADO DE TAREAS
      =========================== */}
      <div className="flex flex-col gap-4">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white p-4 shadow rounded flex justify-between">
            <div>
              <h3 className="font-bold">{t.title}</h3>
              <p className="text-gray-500">{t.description}</p>

              <p className="text-sm mt-1">
                <b>Estado:</b> {t.status}
              </p>

              <p className="text-sm">
                <b>Prioridad:</b> {t.priority}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setEditingTask(t)}
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => handleComplete(t.id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Completar
              </button>

              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDITAR */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
