import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const auth = localStorage.getItem("auth");

  const fetchOrdenes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/ordenes", {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!response.ok) throw new Error("No se pudieron cargar las órdenes");
      const data = await response.json();
      setOrdenes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, [auth]);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); 
  

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <Header></Header>
              <br></br>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Órdenes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="p-3 text-left">Cliente</th>
            <th className="p-3 text-left">Productos</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => {
            const fechaOrden = new Date(o.fecha);
            const caducada = fechaOrden < hoy;

            return (
              <tr
                key={o.id}
                className={`border-b ${caducada ? "line-through text-gray-400" : ""}`}
              >
                <td className="p-3">{o.cliente.nombre}</td>
                <td className="p-3">
                  {o.productos.map((p) => (
                    <div key={p.id}>
                      {p.nombre} (${p.precio})
                    </div>
                  ))}
                </td>
                <td className="p-3">${o.total}</td>
                <td className="p-3">{fechaOrden.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
