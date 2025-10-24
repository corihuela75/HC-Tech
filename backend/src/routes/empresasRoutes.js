/**
 * Archivo: empresasRoutes.js
 * Descripción: Define las rutas para la gestión de empresas en la aplicación.
 */


import { Router } from 'express';
import {
  listarEmpresas,
  obtenerEmpresa,
  mostrarFormularioEditar,
  crearEmpresa,
  actualizarEmpresa,
  borrarEmpresa
} from '../controllers/empresasController.js';
import { verificarTokenYRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Listar y ver empresas: admin o empleado
router.get('/', verificarTokenYRol('admin', 'empleado'), listarEmpresas);
router.get('/:id', verificarTokenYRol('admin', 'empleado'), obtenerEmpresa);
router.get('/:id/edit', verificarTokenYRol('admin'), mostrarFormularioEditar); // solo admin

// Crear, actualizar, eliminar: solo admin
router.post('/', verificarTokenYRol('admin'), crearEmpresa);
router.put('/:id', verificarTokenYRol('admin'), actualizarEmpresa);
router.delete('/:id', verificarTokenYRol('admin'), borrarEmpresa);

export default router;
