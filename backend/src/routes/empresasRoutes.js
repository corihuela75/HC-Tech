import { Router } from 'express';
import {
  listarEmpresas,
  obtenerEmpresa,
  mostrarFormularioEditar,
  crearEmpresa,
  actualizarEmpresa,
  borrarEmpresa
} from '../controllers/empresasController.js';

const router = Router();

router.get('/', listarEmpresas);           // GET /api/empresas
router.get('/:id/edit', mostrarFormularioEditar);  // GET /api/empresas/:id/edit
router.get('/:id', obtenerEmpresa);        // GET /api/empresas/:id
router.post('/', crearEmpresa);            // POST /api/empresas
router.put('/:id', actualizarEmpresa);     // PUT /api/empresas/:id
router.delete('/:id', borrarEmpresa);      // DELETE /api/empresas/:id

export default router;

