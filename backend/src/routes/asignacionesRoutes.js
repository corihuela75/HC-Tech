/**
 * Archivo: asignacionesRoutes.js
 * Descripción: Define las rutas para la gestión de asignaciones en la aplicación.
 */

import { Router } from 'express'
import {
  listarAsignaciones,
  obtenerAsignacion,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion,
} from '../controllers/asignacionesController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Listar y ver asignaciones: admin o empleado
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarAsignaciones)
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerAsignacion)

// Crear, actualizar, eliminar: solo admin
router.post('/', verificarTokenYRol('admin'), isolateByCompany, crearAsignacion)
router.put('/:id', verificarTokenYRol('admin'), isolateByCompany, actualizarAsignacion)
router.delete('/:id', verificarTokenYRol('admin'), isolateByCompany, eliminarAsignacion)

export default router
