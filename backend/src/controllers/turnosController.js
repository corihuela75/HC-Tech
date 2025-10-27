import {
  getTurnosByEmpresa,
  getTurnoById,
  deleteTurno
} from '../models/turnosModel.js'

import { guardarTurno } from '../services/turnosService.js'

const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

const manejarError = (res, funcion, error) => {
  console.error(`Error en ${funcion}:`, error.message || error)
  if (!res.headersSent && !res.req.accepts('html')) {
    return res.status(500).json({ error: `Error al procesar la solicitud en ${funcion}` })
  }
  if (!res.headersSent) {
    return res.status(500).send(`Error al procesar la solicitud en ${funcion}`)
  }
}

// Listar turnos
export const listarTurnos = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const turnos = await getTurnosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('turnos', { titulo: 'Gestión de Turnos', turnos })
    }
    res.json(turnos)
  } catch (error) {
    manejarError(res, 'listarTurnos', error)
  }
}

// Obtener turno 
export const obtenerTurno = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params
    const turno = await getTurnoById(id, empresa_id)

    if (!turno) {
      const msg = 'Turno no encontrado'
      return !esPeticionAPI(req) ? res.status(404).send(msg) : res.status(404).json({ message: msg })
    }

    const turnos = await getTurnosByEmpresa(empresa_id)
    if (!esPeticionAPI(req)) {
      return res.render('turnos', { titulo: 'Editar Turno', turno, turnos })
    }
    res.json(turno)
  } catch (error) {
    manejarError(res, 'obtenerTurno', error)
  }
}

// Crear turno usando servicio
export const crearTurno = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const resultado = await guardarTurno({ ...req.body, empresa_id })

    if (resultado.error) {
      return !esPeticionAPI(req)
        ? res.status(400).send(resultado.error)
        : res.status(400).json({ message: resultado.error })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    res.status(201).json(resultado.data)
  } catch (error) {
    manejarError(res, 'crearTurno', error)
  }
}

// Actualizar turno usando servicio
export const actualizarTurno = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id
    const { id } = req.params
    const resultado = await guardarTurno({ id, ...req.body, empresa_id })

    if (resultado.error) {
      return !esPeticionAPI(req)
        ? res.status(400).send(resultado.error)
        : res.status(400).json({ message: resultado.error })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    res.json(resultado.data)
  } catch (error) {
    manejarError(res, 'actualizarTurno', error)
  }
}

// Eliminar turno 
export const eliminarTurno = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const empresa_id = parseInt(req.query.empresa_id, 10) || 1
    const filasAfectadas = await deleteTurno(id, empresa_id)

    if (filasAfectadas === 0) {
      const msg = 'Turno no encontrado para eliminar'
      return !esPeticionAPI(req)
        ? res.status(404).send(msg)
        : res.status(404).json({ message: msg })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    res.status(200).json({ message: 'Turno eliminado correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarTurno', error)
  }
}
