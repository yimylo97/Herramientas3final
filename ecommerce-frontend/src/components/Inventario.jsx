// src/components/Inventario.jsx

import { useEffect, useState } from "react";
import {
  getInventario,
  createInventario,
  updateInventario,
  deleteInventario,
} from "../services/inventarioApi";

export default function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [form, setForm] = useState({
    idProducto: "",
    cantidadDisponible: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarInventario();
  }, []);

  async function cargarInventario() {
    try {
      setError("");
      const data = await getInventario();
      console.log("Inventario desde backend:", data);
      setInventario(data);
    } catch (e) {
      setError("Error al obtener inventario");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      if (editingId === null) {
        await createInventario(form.idProducto, form.cantidadDisponible);
      } else {
        await updateInventario(editingId, form.cantidadDisponible);
      }

      setForm({ idProducto: "", cantidadDisponible: "" });
      setEditingId(null);
      cargarInventario();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  }

  function handleEdit(item) {
    const idInv = item.idinventario ?? item.idInventario ?? item.id;

    setEditingId(idInv);
    setForm({
      idProducto: item.producto?.idProducto || "",
      cantidadDisponible: item.cantidadDisponible ?? "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await deleteInventario(id);
      cargarInventario();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  }

  return (
    <div className="inventario-page">

      {/* ------------------------ ESTILOS ------------------------ */}
      <style>{`
        .inventario-page {
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
          background: white;
          margin-top: 20px;
          padding: 20px;
          border-radius: 12px;
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
          transition: 0.1s;
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

        .btn-outline {
          background: white;
          border: 1px solid #d1d5db;
        }
        .btn-outline:hover { background: #f3f4f6; }

        .btn-danger {
          background: #ef4444;
          color: white;
        }
        .btn-danger:hover { background: #dc2626; }

        .table-wrapper {
          margin-top: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th {
          background: #f3f4f6;
          text-align: left;
          padding: 10px;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:nth-child(even) { background: #fafafa; }
        tr:hover { background: #eff6ff; }

        .actions {
          display: flex;
          gap: 8px;
        }
      `}</style>

      {/* Encabezado */}
      <h1>Inventario</h1>
      <p className="subtitle">Administra las existencias de los productos.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar registro" : "Nuevo registro"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>ID Producto</label>
            <input
              type="number"
              name="idProducto"
              placeholder="ID Producto"
              value={form.idProducto}
              onChange={handleChange}
              required
              disabled={editingId !== null}
            />
          </div>

          <div className="form-group">
            <label>Cantidad Disponible</label>
            <input
              type="number"
              name="cantidadDisponible"
              placeholder="Cantidad disponible"
              value={form.cantidadDisponible}
              onChange={handleChange}
              required
            />
          </div>

          <div
            className="form-group"
            style={{ display: "flex", alignItems: "end", gap: "8px" }}
          >
            <button className="btn btn-primary" type="submit">
              {editingId ? "Actualizar" : "Guardar"}
            </button>

            {editingId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ idProducto: "", cantidadDisponible: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="card">
        <h2>Lista de inventario</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID Inventario</th>
                <th>ID Producto</th>
                <th>Cantidad disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {inventario.map((i) => {
                const idInv = i.idinventario ?? i.idInventario ?? i.id;

                return (
                  <tr key={idInv}>
                    <td>{idInv}</td>
                    <td>{i.producto?.idProducto}</td>
                    <td>{i.cantidadDisponible}</td>
                    <td className="actions">
                      <button className="btn btn-outline" onClick={() => handleEdit(i)}>
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(idInv)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {inventario.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No hay registros de inventario
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
