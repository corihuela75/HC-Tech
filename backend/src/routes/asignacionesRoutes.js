/**
 * Archivo: asignacionesRoutes.js
 * Descripción: Define las rutas para la gestión de asignaciones en la aplicación.
 */


import { Router } from "express";
import {
  listarAsignaciones,
  obtenerAsignacion,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from "../controllers/asignacionesController.js";

const router = Router();

router.get("/", listarAsignaciones);            // GET /asignaciones?empleado_id=1
router.get("/:id", obtenerAsignacion);         // GET /asignaciones/2?empleado_id=1
router.post("/", crearAsignacion);             // POST /asignaciones
router.delete("/:id", eliminarAsignacion);     // DELETE /asignaciones/2?empleado_id=1
router.put("/:id", actualizarAsignacion);      // PUT /asignaciones/2?empleado_id=1

export default router;
