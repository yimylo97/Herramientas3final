// src/components/Ventas.jsx

import { useEffect, useState } from "react";
import {
  getVentas,
  createVenta,
  updateVenta,
  deleteVenta,
} from "../services/ventasApi";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState({
    idPedido: "",
    idProducto: "",
    cantidad: "",
    total: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  async function cargarVentas() {
    try {
      setError("");
      const data = await getVentas();
      setVentas(data);
    } catch (e) {
      setError("No se pudieron cargar las ventas");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const ventaData = {
      cantidad: Number(form.cantidad),
      total: Number(form.total),
      pedido: {
        idPedido: Number(form.idPedido),
      },
      producto: Number(form.idProducto), // producto ahora es solo un ID
    };

    try {
      setError("");
      if (editingId === null) {
        await createVenta(ventaData);
      } else {
        await updateVenta(editingId, ventaData);
      }

      setForm({ idPedido: "", idProducto: "", cantidad: "", total: "" });
      setEditingId(null);
      cargarVentas();
    } catch (e) {
      setError(e.message || "Error al guardar la venta");
    }
  }

  function handleEdit(v) {
    const id = v.idVenta ?? v.idventa ?? v.id;

    setEditingId(id);

    setForm({
      idPedido: v.pedido?.idPedido || "",
      idProducto: v.producto ?? "",
      cantidad: v.cantidad ?? "",
      total: v.total ?? "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar esta venta?")) return;

    try {
      await deleteVenta(id);
      cargarVentas();
    } catch (e) {
      setError(e.message || "Error al eliminar la venta");
    }
  }

  return (
    <div className="ventas-page">

      {/* ------------------------ ESTILOS ------------------------ */}
      <style>{`
        .ventas-page {
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
      <h1>Gestión de ventas</h1>
      <p className="subtitle">Controla las ventas realizadas por los pedidos del sistema.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar venta" : "Nueva venta"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>ID Pedido</label>
            <input
              type="number"
              name="idPedido"
              value={form.idPedido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ID Producto</label>
            <input
              type="number"
              name="idProducto"
              value={form.idProducto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total</label>
            <input
              type="number"
              step="0.01"
              name="total"
              value={form.total}
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
                  setForm({ idPedido: "", idProducto: "", cantidad: "", total: "" });
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
        <h2>Lista de ventas</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Pedido</th>
                <th>ID Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ventas.map((v) => {
                const id = v.idVenta ?? v.idventa ?? v.id;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{v.pedido?.idPedido}</td>
                    <td>{v.producto}</td>
                    <td>{v.cantidad}</td>
                    <td>${v.total}</td>
                    <td className="actions">
                      <button className="btn btn-outline" onClick={() => handleEdit(v)}>
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {ventas.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No hay ventas registradas
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
