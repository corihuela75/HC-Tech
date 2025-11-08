/**
 * Archivo: marcajesController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de marcajes.
 */

import { getMarcajesByEmpresa, getMarcajesByEmpleado, getMarcajeById, createMarcaje, updateMarcaje, deleteMarcaje, getCurrentMarcajesByEmpresa } from '../models/marcajesModel.js'
import { servicioCrearMarcaje, servicioEliminarMarcaje, servicioModificarMarcaje, servicioRegistrarMarcaje } from '../services/marcajesService.js'

const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

// Helper para manejo uniforme de errores
const manejarError = (res, funcion, error) => {
  console.error(`Error en ${funcion}:`, error.message)
  if (!res.headersSent && !res.req.accepts('html')) {
    return res.status(500).json({ error: `Error al procesar la solicitud en ${funcion}` })
  }
  if (!res.headersSent) {
    return res.status(500).send(`Error al procesar la solicitud en ${funcion}`)
  }
}

//Listar marcajes (por empresa o por empleado)
export const listarMarcajes = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const empleado_id = req.query.empleado_id

    const marcajes = empleado_id ? await getMarcajesByEmpleado(empleado_id, empresa_id) : await getMarcajesByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('marcajes', { titulo: 'Gestión de Marcajes', marcajes })
    }

    res.json(marcajes)
  } catch (error) {
    manejarError(res, 'listarMarcajes', error)
  }
}

//Listar marcajes (por empresa o por empleado)
export const listarMarcajesByCompany = async (req, res) => {
  try {
    const marcajes = await getCurrentMarcajesByEmpresa(req.body);

    if (!esPeticionAPI(req)) {
      return res.render('marcajes', { titulo: 'Gestión de Marcajes', marcajes })
    }

    res.json(marcajes)
  } catch (error) {
    manejarError(res, 'listarMarcajes', error)
  }
}

//Obtener un marcaje por ID
export const obtenerMarcaje = async (req, res) => {
  try {
    const { id } = req.params
    const { empresa_id } = req.query

    const marcaje = await getMarcajeById(id, empresa_id)

    if (!marcaje) {
      if (esPeticionAPI(req)) {
        return res.status(404).json({ mensaje: 'Marcaje no encontrado' })
      }
      return res.status(404).render('error', { mensaje: 'Marcaje no encontrado' })
    }

    // 🔧 Conversión segura de fecha para <input type="datetime-local">
    if (marcaje.fecha_hora instanceof Date) {
      marcaje.fecha_hora = marcaje.fecha_hora.toISOString().slice(0, 16)
    }

    // 💡 PASO CLAVE: Cargamos la lista completa de marcajes
    const marcajes = await getMarcajesByEmpresa(empresa_id)

    if (esPeticionAPI(req)) {
      return res.json(marcaje)
    } else {
      res.render('marcajes', { marcaje, marcajes, titulo: 'Editar Marcaje' })
    }
  } catch (error) {
    console.error('Error al obtener el marcaje:', error)
    res.status(500).render('error', { mensaje: 'Error interno del servidor' })
  }
}

//Crear un nuevo marcaje
export const crearMarcaje = async (req, res) => {
  try {
    const nuevoMarcaje = await servicioCrearMarcaje(req.body );

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/marcajes?empresa_id`)
    }

    res.status(201).json(nuevoMarcaje)
  } catch (error) {
    manejarError(res, 'crearMarcaje', error)
  }
}

//Actualizar un marcaje
export const actualizarMarcaje = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params

    const filasAfectadas = await servicioModificarMarcaje(id, empresa_id, req.body)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Marcaje no encontrado para actualizar')
      }
      return res.status(404).json({ message: 'Marcaje no encontrado para actualizar' })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/marcajes?empresa_id=${empresa_id}`)
    }

    const marcajeActualizado = await getMarcajeById(id, empresa_id)
    res.json(marcajeActualizado)
  } catch (error) {
    manejarError(res, 'actualizarMarcaje', error)
  }
}

//Eliminar un marcaje
export const eliminarMarcaje = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    const filasAfectadas = await servicioEliminarMarcaje(id)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Marcaje no encontrado para eliminar')
      }
      return res.status(404).json({ message: 'Marcaje no encontrado para eliminar' })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/marcajes?empresa_id=${id}`)
    }

    res.status(200).json({ message: 'Marcaje eliminado correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarMarcaje', error)
  }
}