/**
 * Archivo: usuariosRoutes.js
 * Descripción: Define las rutas para la gestión de usuarios en la aplicación.
 */

import { Router } from "express";
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from "../controllers/usuariosController.js";

const router = Router();

router.get("/", listarUsuarios);            // GET /usuarios?empresa_id=1
router.get("/:id", obtenerUsuario);         // GET /usuarios/2?empresa_id=1
router.post("/", crearUsuario);             // POST /usuarios
router.delete("/:id", eliminarUsuario);     // DELETE /usuarios/2?empresa_id=1
router.put("/:id", actualizarUsuario);      // PUT /usuarios/2?empresa_id=1

export default router;