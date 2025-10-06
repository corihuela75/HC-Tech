import pool from "../config/db.js";
    
export const listarEmpresas = async () => {
  const [rows] = await pool.query('SELECT * FROM empresas ORDER BY id DESC');
  return rows;
};

export const obtenerEmpresaPorId = async (id) => {
  const [rows] = await db.query('SELECT * FROM empresas WHERE id = ?', [id]);
  return rows[0];
};

export const crearEmpresa = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO empresas (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
    [data.nombre, data.direccion || null, data.telefono || null, data.email || null]
  );
  return result.insertId;
};

export const actualizarEmpresa = async (id, data) => {
  await pool.query(
    'UPDATE empresas SET nombre = ?, direccion = ?, telefono = ?, email = ? WHERE id = ?',
    [data.nombre, data.direccion || null, data.telefono || null, data.email || null, id]
  );
};

export const eliminarEmpresa = async (id) => {
  await pool.query('DELETE FROM empresas WHERE id = ?', [id]);
};