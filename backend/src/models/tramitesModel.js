/**
 * Archivo: turnosModel.js
 * Descripción: Modelo para gestionar la base de datos de turnos predeterminados (horarios).
 */

import pool from '../config/db.js'

// Listar turnos por empresa

export const obtenerTotalTramites = async (empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM tramites WHERE empresa_id = ?', [empresa_id])
  return rows
}

export const obtenerTramitesByUser = async (empresa_id,empleado_id) => {
  const [rows] = await pool.query('SELECT * FROM tramites WHERE empresa_id = ? AND empleado_id = ?', [empresa_id,empleado_id])
  return rows
}

export const obtenerTramiteById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM tramites WHERE id = ?', [id])
  return rows[0]
}

// Obtener un turno por ID 

export const crearTramite = async (data) => {
    const {empleado_id,empresa_id,asunto,descripcion} = data;
  const [rows] = await pool.query(`
    INSERT INTO tramites (empleado_id,empresa_id,asunto,descripcion) VALUES (?,?,?,?)`,
     [empleado_id,empresa_id,asunto,descripcion])
  return rows.insertId
}


// Actualizar turno 
export const tomarTramite = async (data) => {

  const { id, encargado } = data;

  const [result] = await pool.query(
    `UPDATE tramites 
    SET encargado = ?, estado = ?
    WHERE id = ?`,

    [encargado, "En Progreso", id ]
  )
  return result.affectedRows // Retorna 1 o 0
}

export const cerrarTramite = async (data) => {

  const { id, devolucion, estado } = data;

  const [result] = await pool.query(
    `UPDATE tramites 
    SET devolucion = ?, estado = ?, fecha_cerrado = ? 
    WHERE id = ?`,

    [devolucion, estado, new Date(), id]
  )
  return result.affectedRows // Retorna 1 o 0
}

// Eliminar turno (No requiere cambios)

export const deleteTramite = async (id) => {
  const [result] = await pool.query('DELETE FROM tramites WHERE id = ?', [id])
  return result.affectedRows // Retorna 1 o 0
}