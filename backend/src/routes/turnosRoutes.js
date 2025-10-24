/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.
 */


import { Router } from 'express'
import {
  listarTurnos,
  obtenerTurno,
  crearTurno,
  actualizarTurno,
  eliminarTurno
} from '../controllers/turnosController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router()

// Turnos protegidos por rol
router.get('/', verificarTokenYRol('admin', 'empleado'), listarTurnos)         // listar turnos
router.get('/:id', verificarTokenYRol('admin', 'empleado'), obtenerTurno)     // ver turno
router.post('/', verificarTokenYRol('admin'), crearTurno)                      // solo admin
router.put('/:id', verificarTokenYRol('admin'), actualizarTurno)              // solo admin
router.delete('/:id', verificarTokenYRol('admin'), eliminarTurno)             // solo admin

export default router
