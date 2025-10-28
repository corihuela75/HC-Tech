/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.  
 */

import { Router } from 'express'
import { listarTurnos, obtenerTurno, crearTurno, actualizarTurno, eliminarTurno } from '../controllers/turnosController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Turnos protegidos por rol
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarTurnos) // listar turnos
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerTurno) // ver turno
router.post('/', verificarTokenYRol('admin'), isolateByCompany, crearTurno) // solo admin
router.put('/:id', verificarTokenYRol('admin'), isolateByCompany, actualizarTurno) // solo admin
router.delete('/:id', verificarTokenYRol('admin'), isolateByCompany, eliminarTurno) // solo admin

export default router
