import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerRequest } from "../../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    try {
      await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Cuenta creada correctamente");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Repetir Contraseña"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
