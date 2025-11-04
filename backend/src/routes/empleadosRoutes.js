/**
 * Archivo: empleadosRoutes.js
 * Descripción: Define las rutas para la gestión de empleados en la aplicación.
 */

import { Router } from "express";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerEstadisticas
} from "../controllers/empleadosController.js";
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router();

// Listar y ver empleados: admin o empleado
router.get("/", verificarTokenYRol('admin', 'empleado'), listarEmpleados);       
router.get("/:id", verificarTokenYRol('admin', 'empleado'), obtenerEmpleado);    
router.post("/statics", verificarTokenYRol('admin', 'empleado'), obtenerEstadisticas);

// Crear, actualizar, eliminar: solo admin
router.post("/", verificarTokenYRol('admin'), crearEmpleado);                     
router.put("/:id", verificarTokenYRol('admin'), actualizarEmpleado);              
router.delete("/:id", verificarTokenYRol('admin'), eliminarEmpleado);             

export default router;
