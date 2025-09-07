import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [crearNombre, setCrearNombre] = useState("");
  const [crearPrecio, setCrearPrecio] = useState("");
  

  const auth = localStorage.getItem("auth");
  const role = localStorage.getItem("role");


  const fetchProductos = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/productos/productos"
      );
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

  const abrirModalEditar = (p) => {
    setProductoEditar(p);
    setNuevoNombre(p.nombre);
    setNuevoPrecio(p.precio);
    setModalOpen(true);
  };

  const editarProducto = async () => {
    if (!auth) return alert("Sin permisos");
    try {
      const response = await fetch(
        `http://localhost:8080/api/productos/${productoEditar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            ...productoEditar,
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
          }),
        }
      );
      if (!response.ok) throw new Error("Error al editar producto");
      fetchProductos();
      setModalOpen(false);
      setProductoEditar(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const guardarNuevoProducto = async () => {
    if (!auth) return alert("Sin permisos");
    try {
      const response = await fetch("http://localhost:8080/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          nombre: crearNombre,
          precio: parseFloat(crearPrecio),
          disponible: true,
        }),
      });
      if (!response.ok) throw new Error("Error al crear producto");
      fetchProductos();
      setModalCrearOpen(false);
      setCrearNombre("");
      setCrearPrecio("");
    } catch (err) {
      alert(err.message);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header></Header>
      <br></br>
      <div className="mb-6">
        <h1 className="text-4xl font-extrabold text-black text-center mb-4">
          Lista de Productos
        </h1>
        {auth && (
          <div className="flex justify-end">
            {role === "ADMIN" && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition transform font-semibold"
              onClick={() => setModalCrearOpen(true)}
            >
              Nuevo Producto
            </button>
            )}
          </div>
        )}
      </div>

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
                  p.disponible
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {p.disponible ? "Disponible" : "No disponible"}
              </span>
            </div>
            <p className="mb-4 text-gray-800 font-medium">
              Precio: ${p.precio}
            </p>

            {auth && (
              <div className="flex gap-2">
                 {role === "ADMIN" && (
                <button
                  className="bg-blue-400 text-white px-2 py-2 rounded-lg hover:bg-blue-500 hover:scale-105 transition transform font-semibold"
                  onClick={() => toggleDisponible(p.id, p.disponible)}
                >
                  {p.disponible ? "Marcar No Disponible" : "Marcar Disponible"}
                </button>
                )}

                {role === "ADMIN" && (
                <button
                  className="bg-yellow-300 text-white px-2 py-2 rounded-lg hover:bg-yellow-600 hover:scale-105 transition transform font-semibold"
                  onClick={() => abrirModalEditar(p)}
                >
                  Editar
                </button>
                )}
                {role === "ADMIN" && (
                <button
                  className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition transform font-semibold"
                  onClick={() => eliminarProducto(p.id)}
                >
                  Eliminar
                </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nombre"
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
            />
            <input
              type="number"
              value={nuevoPrecio}
              onChange={(e) => setNuevoPrecio(e.target.value)}
              placeholder="Precio"
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={editarProducto}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalCrearOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Nuevo Producto</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={crearNombre}
              onChange={(e) => setCrearNombre(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
            />
            <input
              type="number"
              placeholder="Precio"
              value={crearPrecio}
              onChange={(e) => setCrearPrecio(e.target.value)}
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalCrearOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={guardarNuevoProducto}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
