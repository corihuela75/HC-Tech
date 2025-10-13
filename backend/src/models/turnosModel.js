/**
 * Archivo: turnosModel.js
 * Descripción: Modelo para gestionar la base de datos de turnos predeterminados (horarios).
 */

import pool from '../config/db.js'

// Listar turnos por empresa

export const getTurnosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM turnos WHERE empresa_id = ?', [empresa_id])
  return rows
}

// Obtener un turno por ID 

export const getTurnoById = async (id, empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM turnos WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return rows[0]
}

// Crear nuevo turno 
export const createTurno = async (turno) => {

  const { empresa_id, nombre, hora_inicio, hora_fin } = turno

  const [result] = await pool.query(
    'INSERT INTO turnos (empresa_id, nombre, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)', 
    [empresa_id, nombre, hora_inicio, hora_fin]
  )

  return {
    id: result.insertId,
    ...turno,
  }
}

// Actualizar turno 
export const updateTurno = async (id, empresa_id, data) => {

  const { nombre, hora_inicio, hora_fin } = data

  const [result] = await pool.query(
    `UPDATE turnos 
    SET nombre = ?, hora_inicio = ?, hora_fin = ? 
    WHERE id = ? AND empresa_id = ?`,

    [nombre, hora_inicio, hora_fin, id, empresa_id]
  )
  return result.affectedRows // Retorna 1 o 0
}

// Eliminar turno (No requiere cambios)

export const deleteTurno = async (id, empresa_id) => {
  const [result] = await pool.query('DELETE FROM turnos WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return result.affectedRows // Retorna 1 o 0
}