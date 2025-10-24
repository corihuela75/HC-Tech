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
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router()

// Login
router.get('/login', mostrarLogin)
router.post('/login', procesarLogin)

// Usuarios protegidos por rol
router.get('/', verificarTokenYRol('admin', 'empleado'), listarUsuarios)     // ambos pueden listar
router.get('/:id', verificarTokenYRol('admin', 'empleado'), obtenerUsuario)  // ambos pueden ver detalle
router.post('/', verificarTokenYRol('admin'), crearUsuario)                   // solo admin
router.put('/:id', verificarTokenYRol('admin'), actualizarUsuario)           // solo admin
router.delete('/:id', verificarTokenYRol('admin'), eliminarUsuario)          // solo admin

export default router
