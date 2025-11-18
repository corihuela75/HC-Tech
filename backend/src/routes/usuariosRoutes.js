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
  logoutUsuario,
  verificarToken,
} from '../controllers/usuariosController.js'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'
import { isolateByCompany } from '../middlewares/isolateByCompany.js'

const router = Router()

// Login
router.get('/login', mostrarLogin)
router.post('/login', procesarLogin)
router.post('/check', verificarToken)

// Logout
router.post('/logout', logoutUsuario)

// Usuarios protegidos por rol
router.get('/', verificarTokenYRol('admin', 'empleado'), isolateByCompany, listarUsuarios) // ambos pueden listar
router.get('/:id', verificarTokenYRol('admin', 'empleado'), isolateByCompany, obtenerUsuario) // ambos pueden ver detalle
router.post('/create', crearUsuario) // solo admin
router.put('/:id', verificarTokenYRol('admin'), isolateByCompany, actualizarUsuario) // solo admin
router.delete('/:id', verificarTokenYRol('admin'), isolateByCompany, eliminarUsuario) // solo admin

export default router
