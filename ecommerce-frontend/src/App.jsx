import { Link, Routes, Route, Navigate } from "react-router-dom";
import Productos from "./components/Productos";
import Clientes from "./components/Clientes";
import Comerciantes from "./components/Comerciantes";
import Usuarios from "./components/Usuarios";
import Pedidos from "./components/Pedidos";
import Inventario from "./components/Inventario";
import Ventas from "./components/Ventas";

function App() {
  const navStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión E-commerce</h1>

      <nav style={navStyle}>
        <Link to="/productos">Productos</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/comerciantes">Comerciantes</Link>
        <Link to="/usuarios">Usuarios</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/inventario">Inventario</Link>
        <Link to="/ventas">Ventas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/productos" />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/comerciantes" element={<Comerciantes />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<Ventas />} />
      </Routes>
    </div>
  );
}

export default App;

