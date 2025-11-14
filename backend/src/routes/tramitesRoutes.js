/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.  
 */

import { Router } from 'express'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { listarTramitesController,crearTramiteController,tomarTramiteController,cerrarTramiteController,eliminarTramiteController } from '../controllers/tramitesController.js'

const router = Router()

// Turnos protegidos por rol
router.post('/listar', verificarTokenYRol('admin', 'empleado'), listarTramitesController) // listar turnos
router.post('/crear', verificarTokenYRol('admin'), crearTramiteController) // solo admin
router.put('/tomar', verificarTokenYRol('admin'), tomarTramiteController) // solo admin
router.put('/cerrar', verificarTokenYRol('admin'), cerrarTramiteController) // solo admin
router.delete('/delete/:id', verificarTokenYRol('admin'), eliminarTramiteController) // solo admin

export default router
