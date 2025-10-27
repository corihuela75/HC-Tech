/**
 * Archivo: parametrosController.js
 * Descripción: Controlador para parámetros, usando empresa_id del token.
 */

import { servicioObtenerParametros,servicioActualizarParametros, servicioCrearParametros, servicioEliminarParametros } from '../services/parametrosService.js'

// ======================================================
// 🔹 Helpers
// ======================================================

// Detecta si la petición es API o Web
const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

// Manejo genérico de errores
const manejarError = (req, res, status, message) => {
  if (!esPeticionAPI(req)) return res.status(status).send(message)
  return res.status(status).json({ message })
}

// Respuesta unificada (vista o JSON)
const responder = (req, res, data, vista, extra = {}) => {
  if (!esPeticionAPI(req)) {
    return res.render(vista, { titulo: 'Gestión de Parámetros', ...data, ...extra })
  }
  return res.json(data)
}

// ======================================================
// 🔹 Controladores CRUD
// ======================================================

// Listar parámetros de la empresa
export const listarParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const parametros = await servicioObtenerParametros(empresa_id)

    if (!parametros) {
      if (!esPeticionAPI(req)) {
        return res.render('Parametros', { titulo: 'Gestión de Parámetros', parametros: null })
      }
      return res.status(404).json({ message: 'Parámetros no encontrados' })
    }

    return responder(req, res, { parametros }, 'Parametros')
  } catch (error) {
    console.error('Error listarParametros:', error.message)
    return manejarError(req, res, 500, 'Error al listar parámetros')
  }
}

// Obtener parámetros (detalle)
export const obtenerParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const parametros = await servicioObtenerParametros(empresa_id)

    if (!parametros) return manejarError(req, res, 404, 'Parámetros no encontrados')

    return responder(req, res, { parametros }, 'parametros/detalle')
  } catch (error) {
    console.error('Error obtenerParametros:', error.message)
    return manejarError(req, res, 500, 'Error al obtener parámetros')
  }s
}

// Crear parámetros
export const crearParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const nuevo = await servicioCrearParametros({ ...req.body, empresa_id })

    if (!esPeticionAPI(req)) return res.redirect('/api/parametros')
    return res.status(201).json({ message: 'Parámetros creados correctamente', parametros: nuevo })
  } catch (error) {
    console.error('Error crearParametros:', error.message)
    return manejarError(req, res, 500, 'Error al crear parámetros')
  }
}

// Actualizar parámetros
export const actualizarParametros = async (req, res) => {
  try {
    
    const empresa_id = req.empresaId
    const actualizado = await servicioActualizarParametros(empresa_id, req.body)

    if (!actualizado) {
      return manejarError(req, res, 404, 'Parámetros no encontrados o sin cambios')
    }

    if (!esPeticionAPI(req)) {
      return res.redirect('/api/parametros')
    }

    const parametrosActualizados = await servicioObtenerParametros(empresa_id)
    return res.json({
      message: 'Parámetros actualizados correctamente',
      parametros: parametrosActualizados
    })
  } catch (error) {
    console.error('Error actualizarParametros:', error.message)
    return manejarError(req, res, 500, 'Error al actualizar parámetros')
  }
}

// Eliminar parámetros
export const borrarParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const eliminado = await servicioEliminarParametros(empresa_id)

    if (!eliminado) return manejarError(req, res, 404, 'Parámetros no encontrados para eliminar')

    if (!esPeticionAPI(req)) return res.redirect('/api/parametros')
    return res.json({ message: 'Parámetros eliminados correctamente' })
  } catch (error) {
    console.error('Error borrarParametros:', error.message)
    return manejarError(req, res, 500, 'Error al eliminar parámetros')
  }
}
