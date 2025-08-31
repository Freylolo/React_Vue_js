import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    const headers = new Headers();
    headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));

    try {
      const response = await fetch("http://localhost:8080/api/clientes/test", {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error("Usuario o contraseña incorrectos");

      const data = await response.text();
      console.log("Login exitoso:", data);

      localStorage.setItem("auth", btoa(`${username}:${password}`));
      setError("");

      alert("Login exitoso");

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

   return (
  <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
    <h2 className="text-3xl font-extrabold text-center text-black-700 mb-8">Login</h2>
    <form onSubmit={login}>
      <div className="mb-6">
        <label className="block text-black font-bold mb-2">Usuario</label>
        <input
          type="text"
          className="w-full border border-gray-400 bg-gray-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
  </div>

  );
}
