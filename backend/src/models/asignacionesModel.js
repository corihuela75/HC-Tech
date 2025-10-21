/**
 * Archivo: asignacionesModel.js
 * Descripción: Modelo para gestionar la base de datos de asignaciones de turnos .
 */

import pool from '../config/db.js'

// Listar asignaciones por empresa
export const getAsignacionesByEmpleado = async (empleado_id) => {
  const [rows] = await pool.query('SELECT * FROM asignaciones_turnos WHERE empleado_id = ?', [empleado_id])
  return rows
}

// Obtener un asignacion por ID
export const getAsignacionById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM asignaciones_turnos WHERE id = ?', [id])
  return rows[0] // 👈 importante
}

// Crear nueva asignación
export const createAsignacion = async (asignacion) => {
  const { empleado_id, turno_id, fecha, hora_inicio_manual, hora_fin_manual } = asignacion

  const [result] = await pool.query(
    'INSERT INTO asignaciones_turnos (empleado_id, turno_id, fecha, hora_inicio_manual, hora_fin_manual) VALUES (?, ?, ?, ?, ?)',
    [empleado_id, turno_id, fecha, hora_inicio_manual, hora_fin_manual]

  )

  return {
    id: result.insertId,
    ...asignacion,
  }
}

// Actualizar asignación
export const updateAsignacion = async (id, empleado_id, data) => {
  const { turno_id, fecha, hora_inicio_manual, hora_fin_manual } = data

  const [result] = await pool.query(
    `UPDATE asignaciones_turnos 
        SET turno_id = ?, fecha = ?, hora_inicio_manual = ?, hora_fin_manual = ? 
        WHERE id = ? AND empleado_id = ?`,

    [turno_id, fecha, hora_inicio_manual, hora_fin_manual, id, empleado_id]
  )
  return result.affectedRows // Retorna 1 o 0
}

// Eliminar asignación
export const deleteAsignacion = async (id, empleado_id) => {
  const [result] = await pool.query('DELETE FROM asignaciones_turnos WHERE id = ? AND empleado_id = ?', [id, empleado_id])
  return result.affectedRows // Retorna 1 o 0
}
