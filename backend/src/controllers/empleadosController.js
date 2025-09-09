import {
  getEmpleadosByEmpresa,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../models/empleadosModel.js";

// Listar empleados
export const listarEmpleados = async (req, res) => {
  try {
    const { empresa_id } = req.query;
    if (!empresa_id) return res.status(400).json({ error: "Falta empresa_id" });

    const empleados = await getEmpleadosByEmpresa(empresa_id);
    res.json(empleados);
  } catch (error) {
    console.error("Error en listarEmpleados:", error.message);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

// Obtener empleado por ID
export const obtenerEmpleado = async (req, res) => {
  try {
    const { empresa_id } = req.query;
    const { id } = req.params;

    const empleado = await getEmpleadoById(id, empresa_id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado" });

    res.json(empleado);
  } catch (error) {
    console.error("Error en obtenerEmpleado:", error.message);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

// Crear empleado
export const crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = await createEmpleado(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error("Error en crearEmpleado:", error.message);
    res.status(500).json({ error: "Error al crear empleado" });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const { empresa_id } = req.query;
    const { id } = req.params;
    const empleadoActualizado = await updateEmpleado(id, empresa_id, req.body);
    res.json(empleadoActualizado);
  } catch (error) {
    console.error("Error en actualizarEmpleado:", error.message);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const { empresa_id } = req.query;
    const { id } = req.params;
    const resultado = await deleteEmpleado(id, empresa_id);
    res.json(resultado);
  } catch (error) {
    console.error("Error en eliminarEmpleado:", error.message);
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};
