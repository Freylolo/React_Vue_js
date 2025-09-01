import { Link, useNavigate } from "react-router-dom";
import calicoLogo from "../assets/calico.png";

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/"); 
  };

  return (
     <div className="bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={calicoLogo} alt="Logo Calico" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-black-600">Cafetería Calico</h1>
      </div>

      <div className="flex gap-4">
        <Link
          to="/home"
          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition"
        >
          Home
        </Link>
        <Link
          to="/clientes"
          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition"
        >
          Clientes
        </Link>
        <Link
          to="/ordenes"
          className="px-3 py-2 rounded-md text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition"
        >
          Órdenes
        </Link>

        {/* Botón cerrar sesión */}
        <button
          onClick={logout}
          className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
