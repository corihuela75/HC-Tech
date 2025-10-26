/**
 * Archivo: parametrosController.js
 * Descripción: Controlador para parámetros, usando empresa_id del token.
 */

import { getParametrosByEmpresa, createParametros, updateParametros, deleteParametros } from '../models/parametrosModel.js'

// Helpers
const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

const manejarError = (req, res, status, message) => {
  if (!esPeticionAPI(req)) return res.status(status).send(message)
  return res.status(status).json({ message })
}

const responder = (req, res, data, vista, extra = {}) => {
  if (!esPeticionAPI(req)) {
    return res.render(vista, { titulo: 'Parámetros de Empresa', ...data, ...extra })
  }
  return res.json(data)
}

// Listar parámetros de la empresa
export const listarParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const parametros = await getParametrosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('Parametros', { titulo: 'Gestión de Parametros', parametros })
    }

    res.json(parametros)
  } catch (error) {
    manejarError(res, 'listarParametros', error)
  }
}

// Obtener parámetros de la empresa
export const obtenerParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const parametros = await getParametrosByEmpresa(empresa_id)

    if (!parametros) return manejarError(req, res, 404, 'Parámetros no encontrados')
    return responder(req, res, { parametros }, 'parametros/detalle')
  } catch (error) {
    console.error('Error obtenerParametros:', error.message)
    return manejarError(req, res, 500, 'Error al obtener parámetros')
  }
}

// Listar Usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const usuarios = await getUsuariosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('Usuarios', { titulo: 'Gestión de Usuarios', usuarios })
    }

    res.json(usuarios)
  } catch (error) {
    manejarError(res, 'listarUsuarios', error)
  }
}

// Crear parámetros
export const crearParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const nuevo = await createParametros({ ...req.body, empresa_id })

    if (!esPeticionAPI(req)) return res.redirect('/api/parametros')
    return res.status(201).json({ message: 'Parámetros creados', parametros: nuevo })
  } catch (error) {
    console.error('Error crearParametros:', error.message)
    return manejarError(req, res, 500, 'Error al crear parámetros')
  }
}

// Actualizar Parámetros
export const actualizarParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId; // se toma del JWT
    const actualizado = await updateParametros(empresa_id, req.body);

    if (!actualizado) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Parámetros no encontrados o sin cambios');
      }
      return res.status(404).json({
        message: 'Parámetros no encontrados o sin cambios',
      });
    }

    if (!esPeticionAPI(req)) {
      return res.redirect('/api/parametros');
    }

    // Opcional: devolver los datos actualizados
    const parametrosActualizados = await getParametrosByEmpresa(empresa_id);
    res.json({
      message: 'Parámetros actualizados',
      parametros: parametrosActualizados
    });
  } catch (error) {
    console.error('Error actualizarParametros:', error.message);
    if (!esPeticionAPI(req)) {
      return res.status(500).send('Error al actualizar parámetros');
    }
    return res.status(500).json({ message: 'Error al actualizar parámetros' });
  }
}



// Eliminar parámetros
export const borrarParametros = async (req, res) => {
  try {
    const empresa_id = req.empresaId
    const eliminado = await deleteParametros(empresa_id)

    if (!eliminado) return manejarError(req, res, 404, 'Parámetros no encontrados para eliminar')

    if (!esPeticionAPI(req)) return res.redirect('/api/parametros')
    return res.json({ message: 'Parámetros eliminados' })
  } catch (error) {
    console.error('Error borrarParametros:', error.message)
    return manejarError(req, res, 500, 'Error al eliminar parámetros')
  }
}
