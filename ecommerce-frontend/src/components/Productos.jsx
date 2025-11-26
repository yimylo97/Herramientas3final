import { useEffect, useState } from "react";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productosApi";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    idComerciante: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setError("");
      const data = await getProductos();
      setProductos(data);
    } catch (e) {
      setError(e.message || "No se pudieron cargar los productos");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productoData = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      comerciante: {
        idComerciante: Number(form.idComerciante),
      },
    };

    try {
      if (editingId === null) {
        await createProducto(productoData);
      } else {
        await updateProducto(editingId, productoData);
      }

      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        idComerciante: "",
      });
      setEditingId(null);
      cargarProductos();
    } catch (e) {
      setError("Error al guardar el producto");
    }
  }

  function handleEdit(prod) {
    setEditingId(prod.idProducto);
    setForm({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      precio: prod.precio,
      idComerciante: prod.comerciante?.idComerciante || "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await deleteProducto(id);
      cargarProductos();
    } catch (e) {
      setError("Error al eliminar el producto");
    }
  }

  return (
    <div className="productos-page">

      {/* -------------- ESTILOS INCRUSTADOS -------------- */}
      <style>{`
        .productos-page {
          max-width: 1000px;
          margin: 30px auto;
          padding: 0 16px 40px;
          font-family: sans-serif;
          color: #111827;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .card {
          background: #fff;
          border-radius: 12px;
          margin-top: 20px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group-full {
          grid-column: 1 / -1;
        }

        input {
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 14px;
        }

        input:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 0 1px #2563eb;
        }

        .btn {
          padding: 7px 14px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: 0.1s ease;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37,99,235,0.4);
        }
        .btn-primary:hover { background: #1d4ed8; }

        .btn-secondary {
          background: #e5e7eb;
        }
        .btn-secondary:hover { background: #d1d5db; }

        .btn-danger {
          background: #ef4444;
          color: white;
        }
        .btn-danger:hover { background: #dc2626; }

        .btn-outline {
          background: white;
          border: 1px solid #d1d5db;
        }
        .btn-outline:hover { background: #f3f4f6; }

        .table-wrapper {
          margin-top: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f3f4f6;
          padding: 10px;
          text-align: left;
          font-size: 14px;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        tr:nth-child(even) {
          background: #fafafa;
        }

        .actions {
          display: flex;
          gap: 8px;
        }
      `}</style>

      {/* Encabezado */}
      <h1>Gestión de productos</h1>
      <p className="subtitle">Administra, crea y edita tus productos fácilmente.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} required />
          </div>

          <div className="form-group form-group-full">
            <label>Descripción</label>
            <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>ID Comerciante</label>
            <input type="number" name="idComerciante" value={form.idComerciante} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ display: "flex", alignItems: "end", gap: "8px" }}>
            <button className="btn btn-primary" type="submit">
              {editingId ? "Actualizar" : "Guardar"}
            </button>

            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={() => {
                setEditingId(null);
                setForm({ nombre: "", descripcion: "", precio: "", idComerciante: "" });
              }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de productos */}
      <div className="card">
        <h2>Lista de productos</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>ID Comerciante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion}</td>
                  <td>${p.precio?.toLocaleString()}</td>
                  <td>{p.comerciante?.idComerciante}</td>
                  <td className="actions">
                    <button className="btn btn-outline" onClick={() => handleEdit(p)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.idProducto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {productos.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                    No hay productos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Productos;
