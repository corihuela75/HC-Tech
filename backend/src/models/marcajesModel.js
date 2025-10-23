/**
 * Archivo: marcajesModel.js
 * Descripción: Modelo para gestionar la base de datos de marcajes (registros de entrada/salida de empleados).
 */

import pool from '../config/db.js'

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

//Obtener un marcaje por ID
export const getMarcajeById = async (id, empresa_id) => {
  const [rows] = await pool.query(
    'SELECT * FROM marcajes WHERE id = ? AND empresa_id = ?',
    [id, empresa_id]
  )
  return rows[0]
}

//Crear nuevo marcaje
export const createMarcaje = async (marcaje) => {
  const { empleado_id, empresa_id, tipo, fecha_hora, metodo } = marcaje

  const [result] = await pool.query(
    `INSERT INTO marcajes (empleado_id, empresa_id, tipo, fecha_hora, metodo)
     VALUES (?, ?, ?, ?, ?)`,
    [empleado_id, empresa_id, tipo, fecha_hora || new Date(), metodo || 'web']
  )

  return {
    id: result.insertId,
    ...marcaje,
  }
}

//Actualizar marcaje (por si se necesita corregir tipo o método)
export const updateMarcaje = async (id, empresa_id, data) => {
  const { tipo, fecha_hora, metodo } = data

  const [result] = await pool.query(
    `UPDATE marcajes 
     SET tipo = ?, fecha_hora = ?, metodo = ?
     WHERE id = ? AND empresa_id = ?`,
    [tipo, fecha_hora, metodo, id, empresa_id]
  )

  return result.affectedRows // 1 si se actualizó, 0 si no
}

//Eliminar marcaje
export const deleteMarcaje = async (id, empresa_id) => {
  const [result] = await pool.query(
    'DELETE FROM marcajes WHERE id = ? AND empresa_id = ?',
    [id, empresa_id]
  )
  return result.affectedRows
}
