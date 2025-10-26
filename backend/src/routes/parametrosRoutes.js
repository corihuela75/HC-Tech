/**
 * Archivo: parametrosRoutes.js
 * Descripción: Define las rutas para la gestión de parámetros de empresa.
 */

import { Router } from 'express'
import { listarParametros, crearParametros, actualizarParametros, borrarParametros } from '../controllers/parametrosController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'
// import { isolateByCompany } from '../middlewares/isolateByCompany.js' // opcional

const router = Router()

// Todas las rutas requieren token y rol 'admin' para modificar
router.get('/', verificarTokenYRol('admin'), isolateByCompany, listarParametros) // solo admin puede crear
router.post('/', verificarTokenYRol('admin'), isolateByCompany, crearParametros) // solo admin puede crear
router.put('/', verificarTokenYRol('admin'), isolateByCompany, actualizarParametros) // solo admin puede actualizar
router.delete('/', verificarTokenYRol('admin'), isolateByCompany, borrarParametros) // solo admin puede borrar

export default router
