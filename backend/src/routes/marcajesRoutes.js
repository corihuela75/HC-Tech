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
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router();

// Listar y ver marcajes: admin o empleado
router.get("/", verificarTokenYRol('admin', 'empleado'), listarMarcajes);       
router.get("/:id", verificarTokenYRol('admin', 'empleado'), obtenerMarcaje);    

// Crear, actualizar, eliminar: solo admin
router.post("/", verificarTokenYRol('admin'), crearMarcaje);                     
router.put("/:id", verificarTokenYRol('admin'), actualizarMarcaje);              
router.delete("/:id", verificarTokenYRol('admin'), eliminarMarcaje);             

export default router;
