/**
 * Archivo: turnosModel.js
 * Descripción: Modelo para gestionar la base de datos de turnos predeterminados (horarios).
 */

import pool from '../config/db.js'
import { reportQuery } from '../querys/reports.js';

// Listar turnos por empresa

export const getReportById = async (body) => {
  const {id:empleado_id, date:mes } = body;
  const [rows] = await pool.query(reportQuery, [
    mes,         
    mes,         
    empleado_id, 
    mes,         
    mes,         
    empleado_id, 
    mes,         
    mes,         
    empleado_id  
]);
return rows;
}
