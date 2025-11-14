/**
 * Archivo: marcajesRoutes.js
 * Descripción: Define las rutas para la gestión de marcajes en la aplicación.
 */

import { Router } from 'express'
import { listarMarcajes, obtenerMarcaje, crearMarcaje, actualizarMarcaje, eliminarMarcaje, listarMarcajesByCompany, actualizarSalidaMarcaje, actualizarEntradaMarcaje } from '../controllers/marcajesController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Listar y ver marcajes: admin o empleado
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarMarcajes)
router.post('/list', verificarTokenYRol("admin", "empleado"), listarMarcajesByCompany)
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerMarcaje)

// Crear, actualizar, eliminar: solo admin
router.post('/', verificarTokenYRol('admin'), crearMarcaje)
router.put('/entrada', verificarTokenYRol('admin'), actualizarEntradaMarcaje)
router.put('/salida', verificarTokenYRol('admin'), actualizarSalidaMarcaje)
router.put('/:id', verificarTokenYRol('admin'), isolateByCompany, actualizarMarcaje)
router.delete('/:id', verificarTokenYRol('admin'), eliminarMarcaje)

export default router
