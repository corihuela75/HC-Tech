import { Router } from "express";
import {
  listarEmpresas,
  crearEmpresa,
  formularioEditar,
  actualizarEmpresa,
  borrarEmpresa
} from "../controllers/empresasController.js";

const router = Router();

router.get("/", listarEmpresas);              // lista + form crear
router.post("/", crearEmpresa);               // crear
router.get("/:id/edit", formularioEditar);    // lista + form editar
router.put("/:id", actualizarEmpresa);        // actualizar
router.delete("/:id", borrarEmpresa);         // borrar

export default router;
