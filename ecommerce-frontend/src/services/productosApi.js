const BASE_URL = "http://localhost:8080/api/productos";

export async function getProductos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function createProducto(producto) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });

  if (!res.ok) {
    const text = await res.text();              
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function updateProducto(id, producto) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return res.json();
}

export async function deleteProducto(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
