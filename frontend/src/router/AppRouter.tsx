import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";

import ProjectsPage from "../projects/ProjectsPage";
import TasksPage from "../pages/tasks/TasksPage";
import ProjectCollaboratorsPage from "../pages/projects/ProjectCollaboratorsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =======================
            RUTAS PÚBLICAS
        ======================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =======================
            RUTAS PROTEGIDAS
        ======================== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardHome />} />

          {/* Proyectos */}
          <Route path="projects" element={<ProjectsPage />} />

          {/* Colaboradores del proyecto */}
          <Route
            path="projects/:id/collaborators"
            element={<ProjectCollaboratorsPage />}
          />

          {/* Tareas */}
          <Route path="tasks" element={<TasksPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
