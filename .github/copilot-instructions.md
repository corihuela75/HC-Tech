# Copilot Instructions for AI Agents

## Arquitectura general
- El proyecto implementa un CRUD de empleados usando Node.js, Express y MySQL.
- El backend está en `/backend/src` y se organiza en:
  - `controllers/`: lógica de negocio (ejemplo: `empleadosController.js`).
  - `models/`: acceso a datos y consultas SQL (ejemplo: `empleadosModel.js`).
  - `routes/api/`: rutas REST para la API (`empleados.js`).
  - `routes/pug/`: rutas para vistas Pug.
  - `views/`: plantillas Pug.
  - `config/db.js`: configuración de conexión a MySQL.
  - `config/saas_app.sql`: esquema SQL de la base de datos.

## Flujos de desarrollo
- Instalar dependencias con `npm install` en `/backend`.
- Configurar `.env` con credenciales de MySQL.
- Levantar el servidor con `npm run dev` (por defecto en puerto 3000).
- Para pruebas rápidas de la base de datos, usar `test-db.js`.

## Convenciones y patrones
- Los controladores reciben y validan datos, delegan a modelos y devuelven respuestas JSON.
- Los modelos gestionan la lógica SQL y devuelven objetos JS.
- Las rutas API siguen el prefijo `/api/empleados` y usan métodos HTTP estándar (GET, POST, PUT, DELETE).
- Los errores se devuelven con códigos HTTP claros (`400`, `404`, `409`, `500`).
- El frontend está en `/fronted` (estructura por definir).

## Ejemplo de flujo API
- Crear empleado: `POST /api/empleados` con JSON.
- Listar empleados: `GET /api/empleados`.
- Obtener empleado: `GET /api/empleados/:id`.
- Actualizar empleado: `PUT /api/empleados/:id`.
- Eliminar empleado: `DELETE /api/empleados/:id`.

## Integraciones y dependencias
- MySQL como base de datos principal.
- Express para el servidor HTTP.
- Pug para vistas (si se usan).
- Variables de entorno en `.env` para configuración sensible.

## Archivos clave
- `/backend/src/app.js`: punto de entrada del servidor Express.
- `/backend/src/controllers/empleadosController.js`: lógica CRUD principal.
- `/backend/src/models/empleadosModel.js`: acceso a datos de empleados.
- `/backend/src/routes/api/empleados.js`: rutas REST de empleados.
- `/backend/src/config/db.js`: conexión a MySQL.

## Notas para agentes
- Mantener la estructura modular y separar lógica de negocio, datos y rutas.
- Seguir los patrones REST y convenciones de error descritas.
- Actualizar este archivo si se agregan nuevos flujos o convenciones relevantes.
