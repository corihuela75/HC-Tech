// src/app.js
import express from "express";
import methodOverride from "method-override";
import createError from "http-errors";
import empleadosRoutes from "./routes/empleadosRoutes.js";
import empresasRoutes from "./routes/empresasRoutes.js";

const app = express();
const PORT = 3000;

// --- Middlewares (el ORDEN importa) ---

// 1. JSON y Formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Method Override: transforma POST en PUT/DELETE
app.use(methodOverride("_method"));

// --- Configuración de Vistas ---
app.set("view engine", "pug");
app.set("views", "./src/views");

// --- Rutas ---
app.get("/", (req, res) => res.redirect("/api/empresas"));
app.use("/api/empleados", empleadosRoutes);
app.use('/api/empresas', empresasRoutes);

// 404
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  if (req.accepts('html')) return res.send(`<h1>Error ${err.status || 500}</h1><pre>${err.message}</pre>`);
  return res.json({ error: err.message });
});


// --- Inicio del Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
