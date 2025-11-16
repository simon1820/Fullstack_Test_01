import { useState } from "react";

interface Props {
  task: any;
  projects: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditTaskModal({ task, projects, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [projectId, setProjectId] = useState(task.projectId);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ title, description, priority, projectId });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-xl w-[400px]">

        <h2 className="text-xl font-bold mb-4">Editar tarea</h2>

        <form onSubmit={handleSubmit}>

          <input
            className="border p-2 rounded w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border p-2 rounded w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full mb-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            className="border p-2 rounded w-full mb-3"
            value={projectId}
            onChange={(e) => setProjectId(Number(e.target.value))}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
