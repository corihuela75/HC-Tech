/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.  
 */

import { Router } from 'express'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { obtenerReporteController } from '../controllers/reportsController.js'

const router = Router()

// Turnos protegidos por rol
router.post('/obtener', verificarTokenYRol('admin'), obtenerReporteController) // solo admin

export default router
