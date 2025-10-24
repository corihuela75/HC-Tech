/**
 * Archivo: ausenciasController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de ausencias (vacaciones, enfermedad, otros).
 */

import {
  getAusenciasByEmpresa,
  getAusenciasByEmpleado,
  getAusenciaById,
  createAusencia,
  updateAusencia,
  deleteAusencia,
} from '../models/ausenciasModel.js'

// Detectar si la petición es API (JSON) o vista web
const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

// Helper genérico de manejo de errores
const manejarError = (res, funcion, error) => {
  console.error(`Error en ${funcion}:`, error.message)
  if (!res.headersSent && !res.req.accepts('html')) {
    return res.status(500).json({ error: `Error al procesar la solicitud en ${funcion}` })
  }
  if (!res.headersSent) {
    return res.status(500).send(`Error al procesar la solicitud en ${funcion}`)
  }
}


// LISTAR AUSENCIAS (por empresa o por empleado)
export const listarAusencias = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const empleado_id = req.query.empleado_id

    const ausencias = empleado_id
      ? await getAusenciasByEmpleado(empleado_id, empresa_id)
      : await getAusenciasByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('ausencias', { titulo: 'Gestión de Ausencias', ausencias })
    }

    res.json(ausencias)
  } catch (error) {
    manejarError(res, 'listarAusencias', error)
  }
}


// OBTENER UNA AUSENCIA POR ID
export const obtenerAusencia = async (req, res) => {
  try {
    const { id } = req.params
    const empresa_id = req.query.empresa_id || 1

    const ausencia = await getAusenciaById(id, empresa_id)

    if (!ausencia) {
      if (esPeticionAPI(req)) {
        return res.status(404).json({ mensaje: 'Ausencia no encontrada' })
      }
      return res.status(404).render('error', { mensaje: 'Ausencia no encontrada' })
    }

    // 🔧 Conversión segura de fechas para los inputs HTML
    if (ausencia.fecha_inicio instanceof Date) {
      ausencia.fecha_inicio = ausencia.fecha_inicio.toISOString().slice(0, 10)
    }
    if (ausencia.fecha_fin instanceof Date) {
      ausencia.fecha_fin = ausencia.fecha_fin.toISOString().slice(0, 10)
    }

    // Cargar todas las ausencias (útil para render)
    const ausencias = await getAusenciasByEmpresa(empresa_id)

    if (esPeticionAPI(req)) {
      return res.json(ausencia)
    } else {
      res.render('ausencias', { ausencia, ausencias, titulo: 'Editar Ausencia' })
    }
  } catch (error) {
    manejarError(res, 'obtenerAusencia', error)
  }
}


// CREAR NUEVA AUSENCIA
export const crearAusencia = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const nuevaAusencia = await createAusencia({ ...req.body, empresa_id })

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/ausencias?empresa_id=${empresa_id}`)
    }

    res.status(201).json(nuevaAusencia)
  } catch (error) {
    manejarError(res, 'crearAusencia', error)
  }
}


// ACTUALIZAR UNA AUSENCIA
export const actualizarAusencia = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params

    const filasAfectadas = await updateAusencia(id, empresa_id, req.body)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Ausencia no encontrada para actualizar')
      }
      return res.status(404).json({ message: 'Ausencia no encontrada para actualizar' })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/ausencias?empresa_id=${empresa_id}`)
    }

    const ausenciaActualizada = await getAusenciaById(id, empresa_id)
    res.json(ausenciaActualizada)
  } catch (error) {
    manejarError(res, 'actualizarAusencia', error)
  }
}


// ELIMINAR AUSENCIA
export const eliminarAusencia = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const empresa_id = parseInt(req.query.empresa_id, 10) || 1

    const filasAfectadas = await deleteAusencia(id, empresa_id)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Ausencia no encontrada para eliminar')
      }
      return res.status(404).json({ message: 'Ausencia no encontrada para eliminar' })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/ausencias?empresa_id=${empresa_id}`)
    }

    res.status(200).json({ message: 'Ausencia eliminada correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarAusencia', error)
  }
}
