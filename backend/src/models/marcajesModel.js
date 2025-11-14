/**
 * Archivo: marcajesModel.js
 * Descripción: Modelo para gestionar la base de datos de marcajes (registros de entrada/salida de empleados).
 */

import pool from '../config/db.js'
import { formatDateForMySQL } from '../services/date-utils.js'

//Listar marcajes por empresa
export const getMarcajesByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM marcajes WHERE empresa_id = ? ORDER BY fecha_hora DESC',
    [empresa_id]
  )
  return rows
}

//Listar marcajes por empleado
export const getMarcajesByEmpleado = async (empleado_id, empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM marcajes WHERE empleado_id = ? AND empresa_id = ? ORDER BY fecha_hora DESC',
    [empleado_id, empresa_id]
  )
  return rows
}

//Listar marcajes por empleado
export const getCurrentMarcajesByEmpresa = async (body) => {
  const {empresa_id, dia } = body;

  // Convertir los strings ISO a formato DATE de MySQL
  const dia_formasteado = dia.split("T")[0];

  const [rows] = await pool.query(
    `SELECT * FROM marcajes WHERE empresa_id = ? AND dia = ?`,
    [empresa_id, dia_formasteado]
  )
  return rows
}

//Obtener un marcaje por ID
export const getMarcajeById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM marcajes WHERE id = ?',
    [id]
  )
  return rows[0]
}

//Crear nuevo marcaje
export const createMarcaje = async (marcaje) => {
  const { empleado_id, empresa_id, dia, hora_inicio, hora_fin } = marcaje;

  const newDate = new Date(dia);

  const [result] = await pool.query(
    `INSERT INTO marcajes (empleado_id, empresa_id, dia, hora_inicio, hora_fin)
     VALUES (?, ?, ?, ?, ?)`,
    [empleado_id, empresa_id, newDate, hora_inicio, hora_fin]
  )

  return {
    id: result.insertId,
    ...marcaje,
  }
}

//Actualizar marcaje (por si se necesita corregir tipo o método)
export const updateMarcaje = async (data) => {
  const { tipo, fecha_hora, metodo } = data

  const [result] = await pool.query(
    `UPDATE marcajes 
     SET tipo = ?, fecha_hora = ?, metodo = ?
     WHERE id = ?`,
    [tipo, fecha_hora, metodo, id, empresa_id]
  )

  return result.affectedRows // 1 si se actualizó, 0 si no
}
export const updateEntradaMarcaje = async (data) => {
  const { entrada, id } = data

  const [result] = await pool.query(
    `UPDATE marcajes 
     SET entrada = ?
     WHERE id = ?`,
    [entrada, id]
  )

  return result[0] // 1 si se actualizó, 0 si no
}
export const updateSalidaMarcaje = async (data) => {
  const { id, salida } = data

  const [result] = await pool.query(
    `UPDATE marcajes 
     SET salida = ?
     WHERE id = ?`,
    [salida, id]
  )

  return result[0] // 1 si se actualizó, 0 si no
}

//Eliminar marcaje
export const deleteMarcaje = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM marcajes WHERE id = ?',
    [id]
  )
  return result.affectedRows
}
