# 🛒 Ecommerce Frontend -- Panel de Administración (React + Vite)

Este documento describe la estructura, propósito y arquitectura general
del proyecto *ecommerce-frontend*, una **SPA (Single Page
Application)** desarrollada en *React* que funciona como interfaz
administrativa para la gestión completa de un sistema e-commerce
B2B/B2C.

La aplicación permite realizar operaciones CRUD sobre **7 entidades
clave del negocio**: productos, clientes, comerciantes, usuarios,
pedidos, inventario y ventas.

------------------------------------------------------------------------

## 🎯 Objetivo del Sistema

El proyecto *ecommerce-frontend* implementa un panel administrativo
desde el cual un usuario con permisos totales puede gestionar:

-   Catálogo de productos\
-   Información de clientes\
-   Información de comerciantes\
-   Usuarios del sistema\
-   Pedidos\
-   Inventario\
-   Ventas

La aplicación asume acceso administrativo (no implementa autenticación
frontend) y se conecta directamente a los endpoints del backend en:\
http://localhost:8080/api/*

------------------------------------------------------------------------

## 🧩 Entidades Principales del Negocio

  --------------------------------------------------------------------------------------------------------
  Entidad        Componente                          API Service                         Propósito
  -------------- ----------------------------------- ----------------------------------- -----------------
  Productos      src/components/Productos.jsx      src/services/productosApi.js      Gestión del
                                                                                         catálogo de
                                                                                         productos

  Clientes       src/components/Clientes.jsx       src/services/clientesApi.js       Clientes: nombre,
                                                                                         dirección,
                                                                                         teléfono

  Comerciantes   src/components/Comerciantes.jsx   src/services/comerciantesApi.js   Cuentas de
                                                                                         comercios

  Usuarios       src/components/Usuarios.jsx       src/services/usuariosApi.js       Datos de usuarios
                                                                                         administradores

  Pedidos        src/components/Pedidos.jsx        src/services/pedidosApi.js        Ciclo de vida de
                                                                                         pedidos

  Inventario     src/components/Inventario.jsx     src/services/inventarioApi.js     Gestión de stock

  Ventas         src/components/Ventas.jsx         src/services/ventasApi.js         Registro de
                                                                                         transacciones
  --------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 🏗 Arquitectura General

### 🔹 Flujo de Inicialización

1.  El usuario ingresa a la app\
2.  *index.html* crea el contenedor <div id="root">\
3.  *main.jsx* monta la app con ReactDOM\
4.  Se inicializa el enrutamiento en <BrowserRouter>\
5.  *App.jsx* evalúa la ruta actual y renderiza el módulo
    correspondiente\
6.  Cada componente realiza useEffect(() => cargarDatos(), [])\
7.  El servicio API ejecuta un *GET* al backend\
8.  El estado se actualiza con los datos recibidos

### 🔹 Patrón 1:1:1 (Componente → Servicio → Backend)

Cada módulo tiene:

-   Un componente React\
-   Un archivo API service\
-   Un endpoint REST correspondiente

Cada servicio implementa:

    getXXX()       // GET - Obtener todos
    createXXX()    // POST - Crear
    updateXXX()    // PUT - Actualizar
    deleteXXX()    // DELETE - Eliminar

------------------------------------------------------------------------

## 🛠 Tecnologías Utilizadas

  Tecnología         Versión    Propósito
  ------------------ ---------- ----------------------------------
  React              \^19.2.0   UI y componentes
  React DOM          \^19.2.0   Renderizado en navegador
  React Router DOM   \^7.9.6    Rutas cliente
  Vite               \^7.2.2    Bundler y servidor de desarrollo
  ESLint             \^9.39.1   Estilo y calidad de código

### Dependencias de desarrollo

-   @vitejs/plugin-react\
-   eslint-plugin-react-hooks\
-   eslint-plugin-react-refresh\
-   @types/react\
-   @types/react-dom

------------------------------------------------------------------------

## 📜 Scripts Disponibles (NPM)

  Comando             Acción
  ------------------- -------------------------------------
  npm run dev       Inicia servidor de desarrollo (HMR)
  npm run build     Genera build producción
  npm run lint      Revisa reglas ESLint
  npm run preview   Previa del build producción

------------------------------------------------------------------------

## 📁 Estructura del Repositorio

    ecommerce-frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── public/
    │   ├── vite.svg
    │   └── react.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── Productos.jsx
        │   ├── Clientes.jsx
        │   ├── Comerciantes.jsx
        │   ├── Usuarios.jsx
        │   ├── Pedidos.jsx
        │   ├── Inventario.jsx
        │   └── Ventas.jsx
        └── services/
            ├── productosApi.js
            ├── clientesApi.js
            ├── comerciantesApi.js
            ├── usuariosApi.js
            ├── pedidosApi.js
            ├── inventarioApi.js
            └── ventasApi.js

------------------------------------------------------------------------

## 🧭 Navegación

-   Barra de navegación presente en todas las vistas\
-   Ruta raíz / → redirige a /productos\
-   Todas las secciones accesibles con un clic

------------------------------------------------------------------------

## 🔗 Integración con Backend

La app consulta un backend REST en:

    http://localhost:8080/api/

Endpoints esperados:

-   /api/productos
-   /api/clientes
-   /api/comerciantes
-   /api/users
-   /api/pedidos
-   /api/inventario
-   /api/ventas

------------------------------------------------------------------------

## 📌 Notas Finales

Este frontend funciona como un panel administrativo completo, modular y
escalable, ideal para controlar todas las entidades principales de un
e-commerce.
