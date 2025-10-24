/**
 * Archivo: ausenciasRoutes.js
 * Descripción: Define las rutas para la gestión de ausencias (vacaciones, enfermedad, otros) en la aplicación.
 */

import { Router } from "express";
import {
  listarAusencias,
  obtenerAusencia,
  crearAusencia,
  actualizarAusencia,
  eliminarAusencia
} from "../controllers/ausenciasController.js";

const router = Router();

router.get("/", listarAusencias);           // GET /ausencias?empresa_id=1
router.get("/:id", obtenerAusencia);        // GET /ausencias/5?empresa_id=1
router.post("/", crearAusencia);            // POST /ausencias
router.put("/:id", actualizarAusencia);     // PUT /ausencias/5?empresa_id=1
router.delete("/:id", eliminarAusencia);    // DELETE /ausencias/5?empresa_id=1

export default router;
