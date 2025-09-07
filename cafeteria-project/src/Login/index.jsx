import { useState } from "react";
import { useNavigate, Link  } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Ingresa email y contraseña");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Usuario o contraseña incorrectos");

    const data = await response.json();
    const encoded = btoa(`${email}:${password}`);
    
    localStorage.setItem("auth", encoded);
    localStorage.setItem("role", data.role); 
    localStorage.setItem("email", data.email);

    console.log("Usuario logueado (auth):", encoded);
    console.log("Rol del usuario:", data.role);

    setError("");
    alert("Login exitoso");
    navigate("/home");
  } catch (err) {
    setError(err.message);
  }
};


   return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Login</h2>
    <form onSubmit={login}>
      <div className="mb-6">
        <label className="block text-black font-bold mb-2">Correo</label>
        <input
          type="text"
          className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-black font-bold mb-2">Contraseña</label>
        <input
          type="password"
          className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 hover:scale-105 transition transform">
        Ingresar
      </button>
    </form>
    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
     <p className="mt-4 text-center text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-500 hover:underline font-semibold"
          >
            Crear usuario
          </Link>
        </p>
  </div>
  </div>

  );
}
