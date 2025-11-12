/**
 * Archivo: usuariosModel.js
 * Descripción: Modelo para gestionar la base de datos de usuarios.
 */

import pool from '../config/db.js'
import bcrypt from 'bcryptjs'



// Listar usuarios por empresa

export const getUsuariosByEmpresa = async (empresa_id) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE empresa_id = ?', [empresa_id])
  return rows
}

// Obtener un usuario por ID

export const getUsuarioById = async (id) => { 
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
  return rows[0]
}


// Crear nuevo usuario
export const createUsuario = async (usuario) => {
  const {  nombre, email, password } = usuario

  // Hashear password
  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await pool.query(
    'INSERT INTO usuarios ( nombre, email, password) VALUES ( ?, ?, ?)',
    [nombre, email, hashedPassword]
  )

  return { id: result.insertId, ...usuario, password: undefined }
}


// Actualizar usuario
export const updateUsuario = async (id, empresa_id, data) => {
  const { nombre, email, password, rol } = data
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null

  const query = hashedPassword
    ? 'UPDATE usuarios SET nombre=?, email=?, password=?, rol=? WHERE id=? AND empresa_id=?'
    : 'UPDATE usuarios SET nombre=?, email=?, rol=? WHERE id=? AND empresa_id=?'

  const params = hashedPassword
    ? [nombre, email, hashedPassword, rol, id, empresa_id]
    : [nombre, email, rol, id, empresa_id]

  const [result] = await pool.query(query, params)
  return result.affectedRows
}

// Actualizar usuario
export const updateUsuarioEmpleadoId = async (id, empleado_id,data) => {
  const {rol, imagen} = data;
  const [result] = await pool.query('UPDATE usuarios SET empleado_id = ?, rol = ?, imagen = ? WHERE id = ?', empleado_id,rol,imagen,id)
  return result.affectedRows
}

// Eliminar usuario

export const deleteUsuario = async (id, empresa_id) => {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ? AND empresa_id = ?', [id, empresa_id])
  return result.affectedRows // Retorna 1 o 0
}

// Buscar usuario por email
export const getUsuarioByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
  return rows[0]
}

