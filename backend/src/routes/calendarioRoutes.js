/**
 * Archivo: turnosRoutes.js
 * Descripción: Define las rutas para la gestión de turnos en la aplicación.  
 */

import { Router } from 'express'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { listarTramitesController,crearTramiteController,tomarTramiteController,cerrarTramiteController,eliminarTramiteController } from '../controllers/tramitesController.js'
import { crearCalendarioController, eliminarCalendarioItemController, listarCalendarioController } from '../controllers/calendarioController.js'

const router = Router()

// Turnos protegidos por rol
router.post('/listar', verificarTokenYRol('admin', 'empleado'), listarCalendarioController) // listar turnos
router.post('/crear', verificarTokenYRol('admin','empleado'), crearCalendarioController) // solo admin
router.delete('/delete/:id', verificarTokenYRol('admin','empleado'), eliminarCalendarioItemController) // solo admin

export default router
