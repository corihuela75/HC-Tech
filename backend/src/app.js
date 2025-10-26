/**
 * Archivo: app.js
 * Descripción: Define la configuración y las rutas de la aplicación.
 */


// src/app.js
import express from "express";
import methodOverride from "method-override";
import createError from "http-errors";
import cookieParser from 'cookie-parser'
import empleadosRoutes from "./routes/empleadosRoutes.js";
import empresasRoutes from "./routes/empresasRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import turnosRoutes from "./routes/turnosRoutes.js";
import asignacionesRoutes from "./routes/asignacionesRoutes.js";
import marcajesRoutes from "./routes/marcajesRoutes.js";
import ausenciasRoutes from "./routes/ausenciasRoutes.js";
import parametrosRoutes from "./routes/parametrosRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cargarUsuarioParaVistas from "./middlewares/localsMiddleware.js";


const app = express();
const PORT = 3000;

// --- Middlewares (el ORDEN importa) ---

//  JSON y Formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear cookies
app.use(cookieParser());

// Method Override: transforma POST en PUT/DELETE
app.use(methodOverride("_method"));

// Middleware para cargar usuario en vistas Pug
app.use(cargarUsuarioParaVistas);

// --- Configuración de Vistas ---
app.set("view engine", "pug");
app.set("views", "./src/views");

// --- Rutas ---
app.get("/", (req, res) => res.redirect("/api/usuarios/login"));
app.use("/api/empleados", empleadosRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/asignaciones", asignacionesRoutes);
app.use("/api/marcajes", marcajesRoutes);
app.use("/api/ausencias", ausenciasRoutes);
app.use("/api/parametros", parametrosRoutes);
app.use("/api/dashboard", dashboardRoutes);



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
