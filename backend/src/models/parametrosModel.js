/**
 * Archivo: parametrosModel.js
 * Descripción: Modelo para gestionar los parámetros configurables por empresa.
 */

import pool from '../config/db.js'

// Obtener parámetros de una empresa
export const getParametrosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM parametros WHERE empresa_id = ?', [empresa_id])
  return rows[0] || null
}

// Crear parámetros para una empresa
export const createParametros = async (data) => {
  const {
    empresa_id,
    jornada_max_diaria = 8.0,
    jornada_max_semanal = 48.0,
    horas_nocturnas_inicio = '21:00:00',
    horas_nocturnas_fin = '06:00:00',
    jornada_max_nocturna = 7.0,
    jornada_max_insalubre = 6.0,
    permite_horas_extras = true,
    max_horas_extras_diarias = 2.0,
    max_horas_extras_semanales = 10.0,
    tiempo_descanso_minimo = 12.0
  } = data

  const [result] = await pool.query(
    `INSERT INTO parametros 
      (empresa_id, jornada_max_diaria, jornada_max_semanal, horas_nocturnas_inicio, horas_nocturnas_fin, 
       jornada_max_nocturna, jornada_max_insalubre, permite_horas_extras, max_horas_extras_diarias, 
       max_horas_extras_semanales, tiempo_descanso_minimo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      empresa_id, jornada_max_diaria, jornada_max_semanal, horas_nocturnas_inicio, horas_nocturnas_fin,
      jornada_max_nocturna, jornada_max_insalubre, permite_horas_extras, max_horas_extras_diarias,
      max_horas_extras_semanales, tiempo_descanso_minimo
    ]
  )

  return { id: result.insertId, ...data }
}

// Actualizar parámetros
export const updateParametros = async (empresa_id, data) => {
  const {
    jornada_max_diaria,
    jornada_max_semanal,
    horas_nocturnas_inicio,
    horas_nocturnas_fin,
    jornada_max_nocturna,
    jornada_max_insalubre,
    permite_horas_extras,
    max_horas_extras_diarias,
    max_horas_extras_semanales,
    tiempo_descanso_minimo
  } = data

  const [result] = await pool.query(
    `UPDATE parametros SET 
      jornada_max_diaria = ?, 
      jornada_max_semanal = ?, 
      horas_nocturnas_inicio = ?, 
      horas_nocturnas_fin = ?, 
      jornada_max_nocturna = ?, 
      jornada_max_insalubre = ?, 
      permite_horas_extras = ?, 
      max_horas_extras_diarias = ?, 
      max_horas_extras_semanales = ?, 
      tiempo_descanso_minimo = ?
     WHERE empresa_id = ?`,
    [
      jornada_max_diaria, jornada_max_semanal, horas_nocturnas_inicio, horas_nocturnas_fin,
      jornada_max_nocturna, jornada_max_insalubre, permite_horas_extras, max_horas_extras_diarias,
      max_horas_extras_semanales, tiempo_descanso_minimo, empresa_id
    ]
  )

  return result.affectedRows > 0
}

// Eliminar parámetros
export const deleteParametros = async (empresa_id) => {
  const [result] = await pool.query('DELETE FROM parametros WHERE empresa_id = ?', [empresa_id])
  return result.affectedRows > 0
}
