import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  const auth = localStorage.getItem("auth"); 

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/productos/productos"); 
      if (!response.ok) throw new Error("No se pudieron cargar los productos");
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const toggleDisponible = async (id, disponible) => {
    if (!auth) return alert("Debes estar logueado para actualizar");
    try {
      const response = await fetch(
        `http://localhost:8080/api/productos/${id}/disponible?disponible=${!disponible}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al actualizar");
      fetchProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (!auth) return alert("Debes estar logueado para eliminar");
    try {
      const response = await fetch(
        `http://localhost:8080/api/productos/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Basic ${auth}` },
        }
      );
      if (!response.ok) throw new Error("Error al eliminar producto");
      fetchProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  const editarProducto = async (p) => {
    if (!auth) return alert("Sin Permisos");
    const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
    const nuevoPrecio = prompt("Nuevo precio:", p.precio);
    if (!nuevoNombre || !nuevoPrecio) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/productos/${p.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            ...p,
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
          }),
        }
      );
      if (!response.ok) throw new Error("Error al editar producto");
      fetchProductos();
    } catch (err) {
      alert(err.message);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-black">Lista de Productos</h1>

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full border border-black-200 bg-white text-black p-3 rounded-lg focus:ring-2 focus:ring-black-400 focus:outline-none shadow-md placeholder-black-300 transition"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((p) => (
          <div
            key={p.id}
            className={`bg-white border border-gray-300 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 ${
              !p.disponible ? "opacity-50" : ""
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-black">{p.nombre}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  p.disponible ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {p.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>
            <p className="mb-4 text-gray-800 font-medium">Precio: ${p.precio}</p>

            {auth && (
              <div className="flex gap-2">
                <button
                  className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 hover:scale-105 transition transform font-semibold"
                  onClick={() => toggleDisponible(p.id, p.disponible)}
                >
                  {p.disponible ? "Marcar No Disponible" : "Marcar Disponible"}
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 hover:scale-105 transition transform font-semibold"
                  onClick={() => editarProducto(p)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition transform font-semibold"
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
