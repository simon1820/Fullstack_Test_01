import { useState } from "react";
import toast from "react-hot-toast";
import { updateTask } from "../../api/tasks.api";

export default function EditTaskModal({ task, projects, onUpdated, onClose }: any) {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [projectId, setProjectId] = useState(task.projectId);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await updateTask(task.id, {
        title,
        description,
        priority,
        status,
        projectId
      });

      toast.success("Tarea actualizada");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("No se pudo actualizar la tarea");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Editar Tarea</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>

          <select
            className="border p-2 rounded"
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
          >
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-600 text-white py-2 rounded">
            Guardar cambios
          </button>
        </form>

        <button className="mt-3 text-gray-600" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
