import pool from "../config/db.js";

// Listar empleados por empresa
export const getEmpleadosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM empleados WHERE empresa_id = ?",
    [empresa_id]
  );
  return rows;
};

// Obtener un empleado por ID
export const getEmpleadoById = async (id, empresa_id) => {
  const [rows] = await pool.query(
    "SELECT * FROM empleados WHERE id = ? AND empresa_id = ?",
    [id, empresa_id]
  );
  return rows[0];
};

// Crear nuevo empleado
export const createEmpleado = async (empleado) => {
  const { empresa_id, nombre, apellido, dni, puesto, fecha_ingreso } = empleado;
  // Si viene en formato ISO, cortamos al YYYY-MM-DD
  const fechaFormateada = fecha_ingreso ? fecha_ingreso.split("T")[0] : null;  
  const [result] = await pool.query(
    "INSERT INTO empleados (empresa_id, nombre, apellido, dni, puesto, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)",
    [empresa_id, nombre, apellido, dni, puesto, fechaFormateada]
  );
  return { id: result.insertId, ...empleado };
};

// Actualizar empleado
export const updateEmpleado = async (id, empresa_id, data) => {
  const { nombre, apellido, dni, puesto, fecha_ingreso, activo } = data;
  
  // Si viene en formato ISO, cortamos al YYYY-MM-DD
  const fechaFormateada = fecha_ingreso ? fecha_ingreso.split("T")[0] : null;

await pool.query(
    `UPDATE empleados 
     SET nombre = ?, apellido = ?, dni = ?, puesto = ?, fecha_ingreso = ?, activo = ? 
     WHERE id = ? AND empresa_id = ?`,
    [nombre, apellido, dni, puesto, fechaFormateada, activo, id, empresa_id]
  );
  return { id, empresa_id, ...data };
};


// Eliminar empleado
export const deleteEmpleado = async (id, empresa_id) => {
  await pool.query("DELETE FROM empleados WHERE id = ? AND empresa_id = ?", [
    id,
    empresa_id,
  ]);
  return { message: "Empleado eliminado" };
};
