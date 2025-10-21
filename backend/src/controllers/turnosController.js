/**
 * Archivo: turnosController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de turnos.
 */

import {
  getTurnosByEmpresa,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno, // ¡Importamos la función limpia del modelo!
} from '../models/turnosModel.js'

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

// Listar turnos
export const listarTurnos = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1 // fijo en 1 para vistas
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
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Turno no encontrado')
      }
      return res.status(404).json({
        message: 'Turno no encontrado',
      })
    }

    // 💡 PASO CLAVE: Cargamos la lista completa de turnos
    const turnos = await getTurnosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('turnos', { titulo: 'Editar Turno', turno, turnos })
    }

    res.json(turno)
  } catch (error) {
    manejarError(res, 'obtenerTurno', error)
  }
}

// Crear turno
export const crearTurno = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const nuevoTurno = await createTurno({ ...req.body, empresa_id })

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    // API: 201 Created
    res.status(201).json(nuevoTurno)
  } catch (error) {
    manejarError(res, 'crearTurno', error)
  }
}

// Actualizar turno
export const actualizarTurno = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1 // fijo en 1 para vistas
    const { id } = req.params

    const filasAfectadas = await updateTurno(id, empresa_id, req.body)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Turno no encontrado para actualizar')
      }
      return res.status(404).json({
        message: 'Turno no encontrado para actualizar',
      })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    // Opcional: devolver los datos actualizados
    const turnoActualizado = await getTurnoById(id, empresa_id)
    res.json(turnoActualizado)
  } catch (error) {
    manejarError(res, 'actualizarTurno', error)
  }
}

// Eliminar turno
export const eliminarTurno = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    // Capturamos empresa_id del query string o default a 1
    const empresa_id = parseInt(req.query.empresa_id, 10) || 1

    // 1. Llama al modelo (que retorna filasAfectadas: 1 o 0)
    const filasAfectadas = await deleteTurno(id, empresa_id)

    // 2. Verifica si la eliminación tuvo efecto
    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Turno no encontrado para eliminar')
      }
      return res.status(404).json({
        message: 'Turno no encontrado para eliminar',
      })
    }

    // 3. Éxito:
    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/turnos?empresa_id=${empresa_id}`)
    }

    // API: 200 OK (No Content o simple mensaje)
    res.status(200).json({
      message: 'Turno eliminado correctamente',
      id: id,
    })
  } catch (error) {
    manejarError(res, 'eliminarTurno', error)
  }
}
