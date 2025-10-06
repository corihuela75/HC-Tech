import { Router } from "express";
import {
  listarEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
} from "../controllers/empleadosController.js";

const router = Router();

router.get("/", listarEmpleados);            // GET /empleados?empresa_id=1
router.get("/:id", obtenerEmpleado);         // GET /empleados/2?empresa_id=1
router.post("/", crearEmpleado);             // POST /empleados
router.delete("/:id", eliminarEmpleado);     // DELETE /empleados/2?empresa_id=1
router.put("/:id", actualizarEmpleado);      // PUT /empleados/2?empresa_id=1



export default router;
