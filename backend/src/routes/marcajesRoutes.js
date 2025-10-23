/**
 * Archivo: marcajesRoutes.js
 * Descripción: Define las rutas para la gestión de marcajes en la aplicación.
 */

import { Router } from "express";
import {
  listarMarcajes,
  obtenerMarcaje,
  crearMarcaje,
  actualizarMarcaje,
  eliminarMarcaje
} from "../controllers/marcajesController.js";

const router = Router();

router.get("/", listarMarcajes);            // GET /marcajes?empresa_id=1
router.get("/:id", obtenerMarcaje);         // GET /marcajes/5?empresa_id=1
router.post("/", crearMarcaje);             // POST /marcajes
router.put("/:id", actualizarMarcaje);      // PUT /marcajes/5?empresa_id=1
router.delete("/:id", eliminarMarcaje);     // DELETE /marcajes/5?empresa_id=1

export default router;
