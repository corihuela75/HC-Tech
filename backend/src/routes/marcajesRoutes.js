/**
 * Archivo: marcajesRoutes.js
 * Descripción: Define las rutas para la gestión de marcajes en la aplicación.
 */

import { Router } from 'express'
import { listarMarcajes, obtenerMarcaje, crearMarcaje, actualizarMarcaje, eliminarMarcaje } from '../controllers/marcajesController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Listar y ver marcajes: admin o empleado
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarMarcajes)
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerMarcaje)

// Crear, actualizar, eliminar: solo admin
router.post('/', verificarTokenYRol('admin'), isolateByCompany, crearMarcaje)
router.put('/:id', verificarTokenYRol('admin'), isolateByCompany, actualizarMarcaje)
router.delete('/:id', verificarTokenYRol('admin'), isolateByCompany, eliminarMarcaje)

export default router
