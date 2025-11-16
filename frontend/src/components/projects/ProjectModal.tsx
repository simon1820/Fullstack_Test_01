import { useState } from "react";

interface Project {
  id?: number;
  name?: string;
  description?: string;
}

interface Props {
  project?: Project | null;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
}

export default function ProjectModal({ project, onClose, onSave }: Props) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    onSave({ name, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {project ? "Editar Proyecto" : "Nuevo Proyecto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Nombre del proyecto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <textarea
            className="border p-2 w-full rounded"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
