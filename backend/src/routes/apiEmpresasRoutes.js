import { Router } from 'express';
import * as model from '../models/empresasModel.js';

const router = Router();

// Listar empresas
router.get('/', async (req,res)=> {
  const items = await model.listarEmpresas();
  res.json(items);
});

// Obtener una empresa
router.get('/:id', async (req,res)=> {
  const item = await model.obtenerEmpresaPorId(req.params.id);
  if(!item) return res.status(404).json({error:'No encontrada'});
  res.json(item);
});

// Crear
router.post('/', async (req,res)=>{
  const id = await model.crearEmpresa(req.body);
  res.status(201).json({id});
});

// Actualizar
router.put('/:id', async (req,res)=>{
  await model.actualizarEmpresa(req.params.id, req.body);
  res.json({ok:true});
});

// Borrar
router.delete('/:id', async (req,res)=>{
  await model.eliminarEmpresa(req.params.id);
  res.json({ok:true});
});

export default router;
