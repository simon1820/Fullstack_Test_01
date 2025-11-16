import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginRequest } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export default function Login() {
  const navigate = useNavigate();

  const setSession = useAuthStore((state) => state.setSession);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginRequest(form);

      setSession(res.data.token, res.data.user);

      toast.success(`¡Bienvenido ${res.data.user.name}!`);
      navigate("/");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Credenciales incorrectas";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded text-white transition ${loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
