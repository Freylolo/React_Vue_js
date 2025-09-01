import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";


export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [showModalOrden, setShowModalOrden] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);

  const auth = localStorage.getItem("auth");

  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clientes", {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (!response.ok) throw new Error("No se pudieron cargar los clientes");
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/productos/productos");
      if (!response.ok) throw new Error("No se pudieron cargar los productos");
      const data = await response.json();
      setProductos(data.filter((p) => p.disponible));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, []);

  const crearCliente = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(nuevoCliente),
      });
      if (!response.ok) throw new Error("Error al crear cliente");
      setShowModalCliente(false);
      setNuevoCliente({ nombre: "", correo: "", telefono: "" });
      fetchClientes();
    } catch (err) {
      alert(err.message);
    }
  };

  const crearOrden = async () => {
  if (!clienteSeleccionado) return;
  if (productosSeleccionados.length === 0) return alert("Selecciona al menos un producto");

  const idsProductos = productosSeleccionados.map(p => p.id);

  try {
    const response = await fetch(
      `http://localhost:8080/api/ordenes?idCliente=${clienteSeleccionado.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(idsProductos),
      }
    );

    if (!response.ok) throw new Error("Error al crear orden");

    setShowModalOrden(false);
    setProductosSeleccionados([]);
    setTotal(0);
    alert("Orden creada correctamente");
  } catch (err) {
    alert(err.message);
  }
};

  const toggleProducto = (producto) => {
    let nuevosSeleccionados;
    if (productosSeleccionados.find((p) => p.id === producto.id)) {
      nuevosSeleccionados = productosSeleccionados.filter((p) => p.id !== producto.id);
    } else {
      nuevosSeleccionados = [...productosSeleccionados, producto];
    }
    setProductosSeleccionados(nuevosSeleccionados);
    const suma = nuevosSeleccionados.reduce((acc, p) => acc + p.precio, 0);
    setTotal(suma);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
         <Header></Header>
              <br></br>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Clientes</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => setShowModalCliente(true)}
        >
          Agregar Cliente
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tabla de clientes */}
      <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Correo</th>
            <th className="p-3 text-left">Teléfono</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr
              key={c.id}
              className={`border-b hover:bg-gray-50 ${
                clienteSeleccionado?.id === c.id ? "bg-blue-50" : ""
              }`}
            >
              <td className="p-3">{c.nombre}</td>
              <td className="p-3">{c.correo}</td>
              <td className="p-3">{c.telefono}</td>
              <td className="p-3 text-center">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  onClick={() => setShowModalOrden(true) || setClienteSeleccionado(c)}
                >
                  Crear Orden
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal agregar cliente */}
      {showModalCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Nuevo Cliente</h2>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
              value={nuevoCliente.nombre}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
              value={nuevoCliente.correo}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, correo: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="w-full border border-blue-200 bg-blue-50 text-black p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 transition"
              value={nuevoCliente.telefono}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowModalCliente(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={crearCliente}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear orden */}
      {showModalOrden && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Crear Orden para {clienteSeleccionado.nombre}
            </h2>
            <div className="max-h-64 overflow-y-auto mb-4">
              {productos.map((p) => (
                <div key={p.id} className="flex justify-between items-center mb-2">
                  <span>{p.nombre}</span>
                  <span>${p.precio.toFixed(2)}</span>
                  <input
                    type="checkbox"
                    checked={!!productosSeleccionados.find((sel) => sel.id === p.id)}
                    onChange={() => toggleProducto(p)}
                  />
                </div>
              ))}
            </div>
            <p className="font-semibold mb-4">Total: ${total.toFixed(2)}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                onClick={() => setShowModalOrden(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={crearOrden}
              >
                Crear Orden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
