import { useState, useEffect } from "react";
import { createProject, updateProject, getProject } from "../api/projects.api";

export default function ProjectForm({ projectId, onFinish }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Cargar datos al editar
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      const res = await getProject(projectId);
      setName(res.data.name);
      setDescription(res.data.description ?? "");
    })();
  }, [projectId]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const data = { name, description };

    if (projectId) {
      await updateProject(projectId, data);
    } else {
      await createProject(data);
    }

    onFinish();
    setName("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-5">
      <input
        className="border w-full p-2 mb-3 rounded"
        placeholder="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="border w-full p-2 mb-3 rounded"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {projectId ? "Actualizar Proyecto" : "Crear Proyecto"}
      </button>
    </form>
  );
}
