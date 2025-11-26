import { useEffect, useState } from "react";
import {
  getPedidos,
  createPedido,
  updatePedido,
  deletePedido,
} from "../services/pedidosApi";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    fechaPedido: "",
    estado: "",
    idCliente: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setError("");
      const data = await getPedidos();
      setPedidos(data);
    } catch (e) {
      setError("No se pudieron cargar los pedidos");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fechaCompleta = form.fechaPedido
      ? form.fechaPedido + "T00:00:00"
      : null;

    const pedidoData = {
      fechaPedido: fechaCompleta,
      estado: form.estado,
      cliente: {
        idCliente: Number(form.idCliente),
      },
    };

    try {
      if (editingId === null) {
        await createPedido(pedidoData);
      } else {
        await updatePedido(editingId, pedidoData);
      }

      setForm({ fechaPedido: "", estado: "", idCliente: "" });
      setEditingId(null);
      cargarPedidos();
    } catch (e) {
      setError(e.message || "Error al guardar el pedido");
    }
  }

  function handleEdit(p) {
    const soloFecha = p.fechaPedido ? p.fechaPedido.substring(0, 10) : "";

    setEditingId(p.idPedido);
    setForm({
      fechaPedido: soloFecha,
      estado: p.estado || "",
      idCliente: p.cliente?.idCliente || "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este pedido?")) return;

    try {
      await deletePedido(id);
      cargarPedidos();
    } catch (e) {
      setError(e.message || "Error al eliminar el pedido");
    }
  }

  return (
    <div className="pedidos-page">

      {/* ------------------------ ESTILOS ------------------------ */}
      <style>{`
        .pedidos-page {
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
      <h1>Gestión de pedidos</h1>
      <p className="subtitle">Administra los pedidos registrados en el sistema.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar pedido" : "Nuevo pedido"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Fecha del pedido</label>
            <input
              type="date"
              name="fechaPedido"
              value={form.fechaPedido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <input
              name="estado"
              value={form.estado}
              onChange={handleChange}
              placeholder="Ej: PENDIENTE / ENVIADO / ENTREGADO"
              required
            />
          </div>

          <div className="form-group">
            <label>ID Cliente</label>
            <input
              type="number"
              name="idCliente"
              value={form.idCliente}
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
                  setForm({ fechaPedido: "", estado: "", idCliente: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de pedidos */}
      <div className="card">
        <h2>Lista de pedidos</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>ID Cliente</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((p) => (
                <tr key={p.idPedido}>
                  <td>{p.idPedido}</td>
                  <td>{p.fechaPedido}</td>
                  <td>{p.estado}</td>
                  <td>{p.cliente?.idCliente}</td>
                  <td className="actions">
                    <button className="btn btn-outline" onClick={() => handleEdit(p)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(p.idPedido)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {pedidos.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No hay pedidos registrados
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
