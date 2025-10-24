/**
 * Archivo: ausenciasModel.js
 * Descripción: Modelo para gestionar la base de datos de ausencias (vacaciones, enfermedad, otros).
 */

import pool from '../config/db.js'

// Listar ausencias por empresa
export const getAusenciasByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ausencias WHERE empresa_id = ? ORDER BY fecha_inicio DESC',
    [empresa_id]
  )
  return rows
}

// Listar ausencias por empleado
export const getAusenciasByEmpleado = async (empleado_id, empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ausencias WHERE empleado_id = ? AND empresa_id = ? ORDER BY fecha_inicio DESC',
    [empleado_id, empresa_id]
  )
  return rows
}

// Obtener una ausencia por ID
export const getAusenciaById = async (id, empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ausencias WHERE id = ? AND empresa_id = ?',
    [id, empresa_id]
  )
  return rows[0]
}

// Crear nueva ausencia
export const createAusencia = async (ausencia) => {
  const { empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin, estado } = ausencia

  const [result] = await pool.query(
    `INSERT INTO ausencias (empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin, estado || 'pendiente']
  )

  return {
    id: result.insertId,
    ...ausencia,
  }
}

// Actualizar ausencia (por ejemplo, para aprobar o modificar fechas)
export const updateAusencia = async (id, empresa_id, data) => {
  const { tipo, fecha_inicio, fecha_fin, estado } = data

  const [result] = await pool.query(
    `UPDATE ausencias 
     SET tipo = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
     WHERE id = ? AND empresa_id = ?`,
    [tipo, fecha_inicio, fecha_fin, estado, id, empresa_id]
  )

  return result.affectedRows // 1 si se actualizó, 0 si no
}

// Eliminar ausencia
export const deleteAusencia = async (id, empresa_id) => {
  const [result] = await pool.query(
    'DELETE FROM ausencias WHERE id = ? AND empresa_id = ?',
    [id, empresa_id]
  )
  return result.affectedRows
}
