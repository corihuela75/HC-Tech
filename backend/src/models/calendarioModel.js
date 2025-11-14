/**
 * Archivo: turnosModel.js
 * Descripción: Modelo para gestionar la base de datos de turnos predeterminados (horarios).
 */

import pool from '../config/db.js'

// Listar turnos por empresa

export const obtenerCalendarioByUser = async (data) => {
  const { id, fecha_inicio, fecha_fin } = data;
  const [rows] = await pool.query('SELECT * FROM calendario WHERE empleado_id = ? and fecha BETWEEN ? AND ?', [id, new Date(fecha_inicio), new Date(fecha_fin)])
  return rows
}
export const obtenerCalendarioById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM calendario WHERE id = ? ', [id])
  return rows[0]
}

export const crearCalendario = async (data) => {
    const {empleado_id,estado,fecha} = data;
  const [rows] = await pool.query(`
    INSERT INTO calendario (empleado_id,estado,fecha) VALUES (?,?,?)`,
     [empleado_id,estado,new Date(fecha)])
  return rows.insertId
}

// Eliminar turno (No requiere cambios)

export const deleteCalendarioItem = async (id) => {
  const [result] = await pool.query('DELETE FROM calendario WHERE id = ?', [id])
  return result.affectedRows // Retorna 1 o 0
}