import { useEffect, useState } from "react";
import {
  getProjects,
  deleteProject,
  updateProject,
  createProject,
} from "../api/projects.api";

import { useNavigate } from "react-router-dom";
import ProjectModal from "../components/projects/ProjectModal";

export default function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar proyecto?")) return;

    try {
      await deleteProject(id);
      alert("Proyecto eliminado");
      fetchProjects();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 403) {
        alert("Solo los administradores pueden eliminar proyectos");
      } else {
        alert("Error eliminando proyecto");
      }
    }
  };

  const handleSave = async (data: any) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }

    setShowModal(false);
    setEditingProject(null);
    fetchProjects();
  };

  if (loading) return <p>Cargando proyectos...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Proyectos</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nuevo Proyecto
        </button>
      </div>

      <ul className="mt-6 space-y-3">
        {projects.map((p) => (
          <li
            key={p.id}
            className="p-4 bg-white shadow flex justify-between items-center rounded"
          >
            <div>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.description}</p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => {
                  setEditingProject(p);
                  setShowModal(true);
                }}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => navigate(`/projects/${p.id}/collaborators`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Colaboradores
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
