// src/services/inventarioApi.js

const BASE_URL = "http://localhost:8080/api/inventario";


export async function getInventario() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al obtener inventario");
  return res.json();
}


export async function createInventario(idProducto, cantidadDisponible) {
  const res = await fetch(`${BASE_URL}/producto/${idProducto}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cantidadDisponible: Number(cantidadDisponible),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}


export async function updateInventario(idInventario, cantidadDisponible) {
  const res = await fetch(`${BASE_URL}/${idInventario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cantidadDisponible: Number(cantidadDisponible),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}


export async function deleteInventario(idInventario) {
  const res = await fetch(`${BASE_URL}/${idInventario}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
}
