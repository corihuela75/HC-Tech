/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.
 */


import { Router } from "express";
import {
  listarTurnos,
  obtenerTurno,
  crearTurno,
  actualizarTurno,
  eliminarTurno
} from "../controllers/turnosController.js";

const router = Router();

router.get("/", listarTurnos);            // GET /turnos?empresa_id=1
router.get("/:id", obtenerTurno);         // GET /turnos/2?empresa_id=1
router.post("/", crearTurno);             // POST /turnos
router.delete("/:id", eliminarTurno);     // DELETE /turnos/2?empresa_id=1
router.put("/:id", actualizarTurno);      // PUT /turnos/2?empresa_id=1

export default router;
