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
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router();

// Listar y ver ausencias: admin o empleado
router.get("/", verificarTokenYRol('admin', 'empleado'), listarAusencias);       
router.get("/:id", verificarTokenYRol('admin', 'empleado'), obtenerAusencia);    

// Crear, actualizar, eliminar: solo admin
router.post("/", verificarTokenYRol('admin'), crearAusencia);                     
router.put("/:id", verificarTokenYRol('admin'), actualizarAusencia);              
router.delete("/:id", verificarTokenYRol('admin'), eliminarAusencia);             

export default router;
