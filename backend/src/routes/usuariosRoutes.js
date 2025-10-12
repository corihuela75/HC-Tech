/**
 * Archivo: usuariosRoutes.js
 * Descripción: Define las rutas para la gestión de usuarios en la aplicación.
 */

import { Router } from 'express'
import {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  mostrarLogin,
  procesarLogin,
} from '../controllers/usuariosController.js'
import { verificarToken } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/login', mostrarLogin)
router.post('/login', procesarLogin)

// OJO QUE LE FALTA VERIFICAR TOKEN
router.get('/', listarUsuarios) // GET /usuarios?empresa_id=1


router.get('/:id', verificarToken, obtenerUsuario) // GET /usuarios/2?empresa_id=1
router.post('/', verificarToken, crearUsuario) // POST /usuarios
router.delete('/:id', verificarToken, eliminarUsuario) // DELETE /usuarios/2?empresa_id=1
router.put('/:id', verificarToken, actualizarUsuario) // PUT /usuarios/2?empresa_id=1

export default router
