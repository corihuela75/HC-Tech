/**
 * Archivo: asignacionesController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de asignaciones de turnos.
 */

import { getAsignacionesByEmpleado, getAsignacionById, createAsignacion, updateAsignacion, deleteAsignacion } from '../models/asignacionesModel.js'

const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''

  // Si pide JSON explícitamente o NO parece un navegador → API
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

// Helper para manejar y reportar errores de manera consistente
const manejarError = (res, funcion, error) => {
  console.error(`Error en ${funcion}:`, error.message)

  // Para API (JSON)
  if (!res.headersSent && !res.req.accepts('html')) {
    return res.status(500).json({ error: `Error al procesar la solicitud en ${funcion}` })
  }

  // Para Vistas (HTML)
  if (!res.headersSent) {
    return res.status(500).send(`Error al procesar la solicitud en ${funcion}`)
  }
}

// 1️ Listar asignaciones por empleado
export const listarAsignaciones = async (req, res) => {
  try {
    const empleado_id = req.query.empleado_id || 1 // fijo en 1 para vistas
    const asignaciones = await getAsignacionesByEmpleado(empleado_id)

    if (!esPeticionAPI(req)) {
      return res.render('asignaciones', { titulo: 'Gestión de Asignaciones', asignaciones })
    }

    res.json(asignaciones)
  } catch (error) {
    manejarError(res, 'listarAsignaciones', error)
  }
}

// 2️ Obtener una asignación por ID (única)
export const obtenerAsignacion = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'Falta el parámetro id' })
    }

    // ✅ Buscar la asignación individual
    const asignacion = await getAsignacionById(id)

    if (!asignacion) {
      const mensaje = 'Asignación no encontrada'
      return esPeticionAPI(req) ? res.status(404).json({ message: mensaje }) : res.status(404).send(mensaje)
    }

    // 🧠 Formatear fecha para que el input type="date" la entienda
    if (asignacion.fecha) {
      asignacion.fecha = new Date(asignacion.fecha).toISOString().split('T')[0]
    }

    // ✅ Cargar también todas las asignaciones del mismo empleado
    const asignaciones = await getAsignacionesByEmpleado(asignacion.empleado_id)

    if (!esPeticionAPI(req)) {
      return res.render('asignaciones', {
        titulo: 'Editar Asignación',
        asignacion,
        asignaciones,
      })
    }

    res.json(asignacion)
  } catch (error) {
    manejarError(res, 'obtenerAsignacion', error)
  }
}

// 3️ Crear asignación
export const crearAsignacion = async (req, res) => {
  try {
    const nuevaAsignacion = await createAsignacion(req.body)

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/asignaciones`)
    }

    res.status(201).json(nuevaAsignacion)
  } catch (error) {
    manejarError(res, 'crearAsignacion', error)
  }
}

// 4️ Actualizar asignación
export const actualizarAsignacion = async (req, res) => {
  try {
    const { id } = req.params
    const empleado_id = req.body.empleado_id || req.query.empleado_id

    if (!empleado_id) {
      return res.status(400).json({ message: 'Falta el parámetro empleado_id' })
    }

    const filasAfectadas = await updateAsignacion(id, empleado_id, req.body)

    if (filasAfectadas === 0) {
      const mensaje = 'Asignación no encontrada para actualizar'
      return esPeticionAPI(req) ? res.status(404).json({ message: mensaje }) : res.status(404).send(mensaje)
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/asignaciones?empleado_id=${empleado_id}`)
    }

    res.json({ message: 'Asignación actualizada correctamente' })
  } catch (error) {
    manejarError(res, 'actualizarAsignacion', error)
  }
}

// 5️ Eliminar asignación (compatible con o sin empleado_id)
export const eliminarAsignacion = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const empleado_id = req.query.empleado_id ? parseInt(req.query.empleado_id, 10) : null

    if (isNaN(id) || (req.query.empleado_id && isNaN(empleado_id))) {
      return res.status(400).json({ message: 'Parámetros inválidos' })
    }

    // Llamada al modelo, pasando empleado_id si existe
    const filasAfectadas = await deleteAsignacion(id, empleado_id)

    if (filasAfectadas === 0) {
      const mensaje = 'Asignación no encontrada para eliminar'
      return esPeticionAPI(req)
        ? res.status(404).json({ message: mensaje })
        : res.status(404).send(mensaje)
    }

    // Para vistas HTML
    if (!esPeticionAPI(req)) {
      return empleado_id
        ? res.redirect(`/api/asignaciones?empleado_id=${empleado_id}`)
        : res.redirect(`/api/asignaciones`)
    }

    // Para API JSON
    res.status(200).json({ message: 'Asignación eliminada correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarAsignacion', error)
  }
}

