/**
 * Archivo: usuarios.Model.js
 * Descripción: Modelo para gestionar la base de datos de usuarios.
 */

import pool from '../db.js'

// Listar usuarios por empresa

export const getUsuariosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE empresa_id = ?', [empresa_id])
  return rows
}

// Obtener un usuario por ID

export const getUsuarioById = async (id, empresa_id) => { 
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return rows[0]
}

// Crear nuevo usuario

export const createUsuario = async (usuario) => {
  const { empresa_id, nombre, email, password, rol } = usuario
  const [result] = await pool.query('INSERT INTO usuarios (empresa_id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)', [
    empresa_id,
    nombre,
    email,
    password,
    rol,
  ])
  return {
    id: result.insertId,
    ...usuario,
  }
}

// Actualizar usuario

export const updateUsuario = async (id, empresa_id, data) => {
  const  { nombre, email, password, rol } = data

  const [result] = await pool.query(
    `UPDATE usuarios 
  SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ? AND empresa_id = ?`,
    [nombre, email, password, rol, id, empresa_id]
  )
  return result.affectedRows // Retorna 1 o 0
}

// Eliminar usuario

export const deleteUsuario = async (id, empresa_id) => {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return result.affectedRows // Retorna 1 o 0
}
