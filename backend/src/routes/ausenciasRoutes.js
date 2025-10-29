/**
 * Archivo: ausenciasRoutes.js
 * Descripción: Define las rutas para la gestión de ausencias (vacaciones, enfermedad, otros) en la aplicación.
 */

import { Router } from 'express'
import { listarAusencias, obtenerAusencia, crearAusencia, actualizarAusencia, eliminarAusencia } from '../controllers/ausenciasController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Listar y ver ausencias: admin o empleado
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarAusencias)
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerAusencia)
router.post('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, crearAusencia)
router.put('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, actualizarAusencia)
router.delete('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, eliminarAusencia)

export default router
