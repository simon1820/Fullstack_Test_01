import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/axios";

export default function EditProjectModal({ project, onClose, refresh }: any) {

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await api.put(`/projects/${project.id}`, { name, description });
      toast.success("Proyecto actualizado");
      refresh();
      onClose();
    } catch (err) {
      toast.error("No se pudo actualizar el proyecto");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Editar Proyecto</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            className="border p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <textarea
            className="border p-2 rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button className="bg-blue-600 text-white py-2 rounded">
            Guardar Cambios
          </button>

        </form>

        <button className="mt-4 text-gray-500" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
