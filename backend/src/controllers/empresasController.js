/**
 * Archivo: empresasController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de empresas.
 */


import { getEmpresas, getEmpresaById, createEmpresa, updateEmpresa, deleteEmpresa } from '../models/empresasModel.js'

// Helper para decidir respuesta (API vs Vistas)
const responder = (req, res, data, vista, extra = {}) => {
  if (!esPeticionAPI(req)) {
    return res.render(vista, {
      titulo: 'Gestión de Empresas',
      ...data,
      ...extra,
    })
  }
  return res.json(data)
}

const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''

  // Si pide JSON explícitamente o NO parece un navegador → API
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}


// NUEVO: Helper para manejar errores 404 y 500 de forma consistente (JSON vs HTML)
const manejarRespuestaError = (req, res, status, message) => {
  if (!esPeticionAPI(req)) {
    return res.status(status).send(message)
  }
  return res.status(status).json({
    message,
  })
}

// Listar empresas
export const listarEmpresas = async (req, res) => {
  try {
    const empresas = await getEmpresas()
    return responder(req, res, { empresas }, 'empresas')
  } catch (error) {
    console.error('Error en listarEmpresas:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al obtener empresas') // Usa el helper para 500
  }
}

export const listarEmpresasByUser = async (req, res) => {
  try {
    const empresas = await getEmpresas(req.body.user_id)
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Error en listarEmpresas:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al obtener empresas')
  }
}

// Mostrar formulario para editar
export const mostrarFormularioEditar = async (req, res) => {
  try {
    const id = req.params.id
    const empresa = await getEmpresaById(id)

    if (!empresa) {
      return manejarRespuestaError(req, res, 404, 'Empresa no encontrada')
    }

    const empresas = await getEmpresas()

    return responder(req, res, { empresa, empresas }, 'empresas', {
      titulo: 'Editar Empresa', // Puedes forzar el título aquí si es necesario
    })
  } catch (error) {
    console.error('Error en mostrarFormularioEditar:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al cargar el formulario de edición') // Usa el helper para 500
  }
}

// Obtener empresa (solo JSON o vista detallada)
export const obtenerEmpresa = async (req, res) => {
  try {
    const { id } = req.params
    const empresa = await getEmpresaById(id)

    if (!empresa) {
      // Usa el helper para 404
      return manejarRespuestaError(req, res, 404, 'Empresa no encontrada')
    }

    return responder(req, res, { empresa }, 'empresas/detalle')
  } catch (error) {
    console.error('Error en obtenerEmpresa:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al obtener empresa') // Usa el helper para 500
  }
}

// Crear empresa
export const crearEmpresa = async (req, res) => {
  try {
    const nuevaEmpresa = await createEmpresa(req.body)

    if (!esPeticionAPI(req)) {
      return res.redirect('/api/empresas')
    }

    // API: 201 Created
    res.status(201).json({ message: 'Empresa creada correctamente', empresa: nuevaEmpresa })
  } catch (error) {
    console.error('Error en crearEmpresa:', error.message)
    // Usa el helper para 500
    return manejarRespuestaError(req, res, 500, 'Error al crear empresa')
  }
}

// Actualizar empresa
export const actualizarEmpresa = async (req, res) => {
  try {
    const empresaActualizada = await updateEmpresa(req.body)

    if (!empresaActualizada) {
      // Usa el helper para 404
      return manejarRespuestaError(req, res, 404, 'Empresa no encontrada')
    }

    if (!esPeticionAPI(req)) {
      return res.redirect('/api/empresas')
    }

    res.json({ message: 'Empresa actualizada', empresa: empresaActualizada })
  } catch (error) {
    console.error('Error en actualizarEmpresa:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al actualizar empresa') // Usa el helper para 500
  }
}

// Eliminar empresa
export const borrarEmpresa = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await deleteEmpresa(id)

    // Asumiendo que 'resultado' es un valor que indica si se eliminó algo (e.g., true/false o nro de filas afectadas > 0)
    if (!resultado) {
      return manejarRespuestaError(req, res, 404, 'Empresa no encontrada para eliminar') // Usa el helper para 404
    }

    if (!esPeticionAPI(req)) {
      return res.redirect('/api/empresas')
    }

    res.json({
      message: 'Empresa eliminada',
    })
  } catch (error) {
    console.error('Error en borrarEmpresa:', error.message)
    return manejarRespuestaError(req, res, 500, 'Error al eliminar empresa') // Usa el helper para 500
  }
}
