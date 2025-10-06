import {
  getEmpleadosByEmpresa,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../models/empleadosModel.js";

// Helper para decidir respuesta (API vs Vistas)
const responder = (req, res, data, vista, extra = {}) => {
  if (req.accepts("html")) {
    return res.render(vista, {
      titulo: "Gestión de Empleados",
      ...data,
      ...extra
    });
  }
  return res.json(data);
};

// Listar empleados
export const listarEmpleados = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1; // fijo en 1 para vistas
    const empleados = await getEmpleadosByEmpresa(empresa_id);

    if (req.accepts("html")) {
      return res.render("empleados", {
        empleados
      });
    }

    res.json(empleados);
  } catch (error) {
    console.error("Error en listarEmpleados:", error.message);
    res.status(500).send("Error al obtener empleados");
  }
};

// Obtener empleado
export const obtenerEmpleado = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1;
    const {
      id
    } = req.params;
    const empleado = await getEmpleadoById(id, empresa_id);

    if (!empleado) return res.status(404).send("Empleado no encontrado");

    if (req.accepts("html")) {
      return res.render("Empleados_editar", {
        titulo: "Editar Empleado",
        empleado
      });
    }

    res.json(empleado);
  } catch (error) {
    console.error("Error en obtenerEmpleado:", error.message);
    res.status(500).send("Error al obtener empleado");
  }
};

// Crear empleado
export const crearEmpleado = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1;
    const nuevoEmpleado = await createEmpleado({
      ...req.body,
      empresa_id
    });

    if (req.accepts("html")) {
      return res.redirect("/api/empleados");
    }

    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error("Error en crearEmpleado:", error.message);
    res.status(500).send("Error al crear empleado");
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1;
    const {
      id
    } = req.params;
    const empleadoActualizado = await updateEmpleado(id, empresa_id, req.body);

    if (req.accepts("html")) {
      return res.redirect("/api/empleados");
    }

    res.json(empleadoActualizado);
  } catch (error) {
    console.error("Error en actualizarEmpleado:", error.message);
    res.status(500).send("Error al actualizar empleado");
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {

    const id = parseInt(req.params.id, 10);
    const empresa_id = parseInt(req.body.empresa_id || req.query.empresa_id, 10) || 1;

    const resultado = await deleteEmpleado(id, empresa_id);

    if (req.accepts("html")) {
      return res.redirect("/api/empleados");
    }

    res.json({ message: "Empleado eliminado", resultado });
  } catch (error) {
    console.error("Error en eliminarEmpleado:", error.message);
    res.status(500).send("Error al eliminar empleado");
  }
};
