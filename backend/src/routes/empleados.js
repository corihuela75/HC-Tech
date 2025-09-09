import express from "express";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleadosController.js";

const router = express.Router();

// GET /api/empleados?empresa_id=1
router.get("/", listarEmpleados);

// GET /api/empleados/:id?empresa_id=1
router.get("/:id", obtenerEmpleado);

// POST /api/empleados
router.post("/", crearEmpleado);

// PUT /api/empleados/:id?empresa_id=1
router.put("/:id", actualizarEmpleado);

// DELETE /api/empleados/:id?empresa_id=1
router.delete("/:id", eliminarEmpleado);

export default router;
