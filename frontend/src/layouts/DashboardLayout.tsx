import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden">

      {/* SIDEBAR (FIJO) */}
      <aside className="w-64 bg-white shadow-lg p-5 flex flex-col border-r">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">
            ProjectManager
          </h2>

          {/* User info */}
          <div className="mb-6 border-b pb-4">
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs mt-2 px-2 py-1 rounded bg-blue-100 text-blue-600 inline-block">
              Rol: {user?.role}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <Link className="text-gray-700 hover:text-blue-600" to="/">
              Dashboard
            </Link>

            <Link className="text-gray-700 hover:text-blue-600" to="/projects">
              Proyectos
            </Link>

            <Link className="text-gray-700 hover:text-blue-600" to="/tasks">
              Tareas
            </Link>
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENT (SCROLLEABLE) */}
      <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
