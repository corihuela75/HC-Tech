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
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router();

// Listar y ver asignaciones: admin o empleado
router.get("/", verificarTokenYRol('admin', 'empleado'), listarAsignaciones);       
router.get("/:id", verificarTokenYRol('admin', 'empleado'), obtenerAsignacion);    

// Crear, actualizar, eliminar: solo admin
router.post("/", verificarTokenYRol('admin'), crearAsignacion);                     
router.put("/:id", verificarTokenYRol('admin'), actualizarAsignacion);              
router.delete("/:id", verificarTokenYRol('admin'), eliminarAsignacion);             

export default router;
