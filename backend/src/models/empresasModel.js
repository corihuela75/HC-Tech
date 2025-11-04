/**
 * Archivo: empresasModel.js
 * Descripción: Modelo para gestionar la base de datos de empresas.
 */


import pool from "../config/db.js";

export const getEmpresas = async (user_id) => {
  const [rows] = await pool.query('SELECT * FROM empresas WHERE user_id = ? ORDER BY id DESC', [user_id]);
  return rows;
};

export const getEmpresaById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM empresas WHERE id = ?', [id]);
  return rows[0];
};

export const createEmpresa = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO empresas (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
    [data.nombre, data.direccion || null, data.telefono || null, data.email || null]
  );
  return result.insertId;
};


export const updateEmpresa = async (data) => {
const {
  id,
nombre,
pag_web,
direccion,
razon_social,
created_at,
email,
telefono,
imagen,
cuit,
} = data;

  const [result] = await pool.query(
    'UPDATE empresas SET nombre = ?, pag_web = ?, razon_social = ?, created_at = ?, direccion = ?, telefono = ?, imagen = ?, email = ?, cuit = ? WHERE id = ?',
    [nombre, pag_web, razon_social, created_at, direccion, telefono, imagen, email, cuit, id]
  );
  // Retorna true si 1 fila fue afectada, false en caso contrario.
  return result.affectedRows === 1;
};

export const deleteEmpresa = async (id) => {
  const [result] = await pool.query('DELETE FROM empresas WHERE id = ?', [id]);
  // Retorna true si 1 fila fue afectada, false en caso contrario.
  // Esto también arreglará el flujo de error de eliminación si aplicas el mismo patrón.
  return result.affectedRows === 1;
};
