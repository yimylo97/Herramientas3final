import { useEffect, useState } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/clientesApi";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    idUsuario: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    try {
      setError("");
      const data = await getClientes();
      setClientes(data);
    } catch (e) {
      setError("No se pudieron cargar los clientes");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const clienteData = {
      nombre: form.nombre,
      direccion: form.direccion,
      telefono: form.telefono,
      usuario: {
        idUsuario: Number(form.idUsuario),
      },
    };

    try {
      if (editingId === null) {
        await createCliente(clienteData);
      } else {
        await updateCliente(editingId, clienteData);
      }

      setForm({ nombre: "", direccion: "", telefono: "", idUsuario: "" });
      setEditingId(null);
      cargarClientes();
    } catch (e) {
      setError(e.message || "Error al guardar el cliente");
    }
  }

  function handleEdit(c) {
    setEditingId(c.idCliente);
    setForm({
      nombre: c.nombre,
      direccion: c.direccion,
      telefono: c.telefono,
      idUsuario: c.usuario?.idUsuario || "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await deleteCliente(id);
      cargarClientes();
    } catch (e) {
      setError(e.message || "Error al eliminar el cliente");
    }
  }

  return (
    <div className="clientes-page">

      {/* ------------------------ ESTILOS ------------------------ */}
      <style>{`
        .clientes-page {
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
      <h1>Gestión de clientes</h1>
      <p className="subtitle">Administra la información de tus clientes.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar cliente" : "Nuevo cliente"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group form-group-full">
            <label>Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ID Usuario</label>
            <input
              type="number"
              name="idUsuario"
              value={form.idUsuario}
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
                  setForm({
                    nombre: "",
                    direccion: "",
                    telefono: "",
                    idUsuario: "",
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de clientes */}
      <div className="card">
        <h2>Lista de clientes</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>ID Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((c) => (
                <tr key={c.idCliente}>
                  <td>{c.idCliente}</td>
                  <td>{c.nombre}</td>
                  <td>{c.direccion}</td>
                  <td>{c.telefono}</td>
                  <td>{c.usuario?.idUsuario}</td>
                  <td className="actions">
                    <button className="btn btn-outline" onClick={() => handleEdit(c)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(c.idCliente)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {clientes.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No hay clientes registrados
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
