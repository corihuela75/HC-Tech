/**
 * Archivo: empresasRoutes.js
 * Descripción: Define las rutas para la gestión de empresas en la aplicación.
 */


import { Router } from 'express';
import {
  listarEmpresas,
  listarEmpresasByUser,
  obtenerEmpresa,
  mostrarFormularioEditar,
  crearEmpresa,
  actualizarEmpresa,
  borrarEmpresa
} from '../controllers/empresasController.js';
import { verificarTokenYRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Listar y ver empresas: Solo superadmin
router.get('/', verificarTokenYRol(), listarEmpresas);
router.get('/:id', verificarTokenYRol('admin', 'empleado'), obtenerEmpresa);
router.get('/:id/edit', verificarTokenYRol(), mostrarFormularioEditar); // solo admin
router.post('/', verificarTokenYRol(), crearEmpresa);
router.post('/empresaById', verificarTokenYRol("admin","empleado"), listarEmpresasByUser);
router.put('/', verificarTokenYRol(), actualizarEmpresa);
router.delete('/:id', verificarTokenYRol(), borrarEmpresa);

export default router;
