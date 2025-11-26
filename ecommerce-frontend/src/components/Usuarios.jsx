import { useEffect, useState } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usuariosApi";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    estado: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      setError("");
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (e) {
      setError("No se pudieron cargar los usuarios");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const usuarioData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      estado: form.estado,
    };

    try {
      if (editingId === null) {
        await createUsuario(usuarioData);
      } else {
        await updateUsuario(editingId, usuarioData);
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        estado: "",
      });
      setEditingId(null);
      cargarUsuarios();
    } catch (e) {
      setError(e.message || "Error al guardar el usuario");
    }
  }

  function handleEdit(u) {
    setEditingId(u.idUser);
    setForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      password: "",
      estado: u.estado || "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      cargarUsuarios();
    } catch (e) {
      setError(e.message || "Error al eliminar el usuario");
    }
  }

  return (
    <div className="usuarios-page">

      {/* ------------------------ ESTILOS ------------------------ */}
      <style>{`
        .usuarios-page {
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
      <h1>Gestión de usuarios</h1>
      <p className="subtitle">Administra los usuarios registrados en el sistema.</p>

      {/* Formulario */}
      <div className="card">
        <h2>{editingId ? "Editar usuario" : "Nuevo usuario"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label>Correo</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
              value={form.password}
              onChange={handleChange}
              required={editingId === null}
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <input
              name="estado"
              placeholder="ACTIVO / INACTIVO"
              value={form.estado}
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
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    estado: "",
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="card">
        <h2>Lista de usuarios</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.idUser}>
                  <td>{u.idUser}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.estado}</td>
                  <td className="actions">
                    <button className="btn btn-outline" onClick={() => handleEdit(u)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(u.idUser)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#6b7280",
                    }}
                  >
                    No hay usuarios registrados
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
