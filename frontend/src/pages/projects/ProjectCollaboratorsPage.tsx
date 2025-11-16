import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  getProjectCollaborators, 
  addProjectCollaborator, 
  removeProjectCollaborator 
} from "../../api/projects.api";

export default function ProjectCollaboratorsPage() {
  const { id } = useParams();
  const projectId = Number(id);

  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  async function loadCollaborators() {
    const res = await getProjectCollaborators(projectId);
    setCollaborators(res.data);
  }

  useEffect(() => {
    loadCollaborators();
  }, []);

  async function handleAdd() {
    if (!email.trim()) return toast.error("Ingresa un email");

    try {
      await addProjectCollaborator(projectId, email);
      toast.success("Colaborador agregado");
      setEmail("");
      loadCollaborators();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Error al agregar colaborador");
    }
  }

  async function handleDelete(collabId: number) {
    toast(
      (t) => (
        <span>
          ¿Eliminar colaborador?
          <button
            className="ml-3 px-2 py-1 bg-red-600 text-white rounded text-xs"
            onClick={async () => {
              await removeProjectCollaborator(projectId, collabId);
              toast.dismiss(t.id);
              toast.success("Eliminado");
              loadCollaborators();
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
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Colaboradores del Proyecto</h1>

      <div className="bg-white shadow p-4 rounded mb-4 flex gap-3">
        <input
          type="email"
          className="border p-2 rounded flex-1"
          placeholder="Email del colaborador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </div>

      <ul className="space-y-3">
        {collaborators.map((c) => (
          <li key={c.id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <p className="font-semibold">{c.user.name}</p>
              <p className="text-gray-600">{c.user.email}</p>
            </div>

            <button
              onClick={() => handleDelete(c.id)}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
