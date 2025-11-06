/**
 * Archivo: empleadosModel.js
 * Descripción: Modelo para gestionar la base de datos de empleados.
 */


import pool from '../config/db.js'
import { get_statics, listarEmpleadosQuery } from '../querys/empleados.js'

// Listar empleados por empresa

export const getEmpleadosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query(listarEmpleadosQuery, [empresa_id])
  return rows
}

// Obtener un empleado por ID
export const getEmpleadoById = async (id, empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM empleados WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return rows[0]
}

// Obtener un empleado por email
export const getEmpleadoByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM empleados WHERE email = ?', [email])
  return rows[0]
}

export const getStaticsByEmployeeId = async (empleado_id, empresa_id) => {
  const [rows] = await pool.query(get_statics, [empleado_id, empresa_id])
  return rows[0]
}

// Crear nuevo empleado

export const createEmpleado = async (empleado) => {
  
  const { empresa_id, nombre, telefono, email, direccion, fecha_nac, turno, dni, estado, imagen, puesto, fecha_ingreso, fecha_egreso, created_at, rol } = empleado;
  
  const activo = true;
  // Si viene en formato ISO, cortamos al YYYY-MM-DD
  const fechaFormateada = fecha_ingreso ? fecha_ingreso.split('T')[0] : null
  const [result] = await pool.query('INSERT INTO empleados (empresa_id, nombre, telefono, email, direccion, fecha_nac, turno, dni, estado, imagen, puesto, fecha_ingreso, fecha_egreso, created_at, rol, activo) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )', [
    empresa_id, nombre, telefono, email, direccion, fecha_nac, turno, dni, estado, imagen, puesto, fechaFormateada, fecha_egreso, created_at, rol, activo ])
  return {
    id: result.insertId,
    ...empleado,
  }
}

// Actualizar empleado

export const updateEmpleado = async (data) => {
  const { id, empresa_id, nombre, telefono, email, direccion, fecha_nac, turno, dni, estado, imagen, puesto, fecha_ingreso, fecha_egreso, created_at, rol } = data;
  const fechaFormateada = fecha_ingreso ? fecha_ingreso.split('T')[0] : null
  const [result] = await pool.query('UPDATE empleados SET nombre = ?, telefono = ?, email = ?, direccion = ?, fecha_nac = ?, turno = ?, dni = ?, estado = ?, imagen = ?, puesto = ?, fecha_ingreso = ?, fecha_egreso = ?, created_at = ?, rol = ? WHERE id = ? AND empresa_id = ?', [
    nombre, telefono, email, direccion, fecha_nac, turno, dni, estado, imagen, puesto, fechaFormateada, fecha_egreso, created_at, rol, id, empresa_id ])

  // const [result] = await pool.query(
  //   `UPDATE empleados 
  // SET nombre = ?, dni = ?, puesto = ?, fecha_ingreso = ?, activo = ? 
  // WHERE id = ? AND empresa_id = ?`,
  //   [nombre, dni, puesto, fechaFormateada, activo, id, empresa_id]
  // )
  return result.affectedRows // Retorna 1 o 0
}

// Eliminar empleado

export const deleteEmpleado = async (id) => {
  const [result] = await pool.query('DELETE FROM empleados WHERE id = ?', [id])
  return result.affectedRows // Retorna 1 o 0
}
