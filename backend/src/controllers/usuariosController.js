/**
 * Archivo: usuariosController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de usuarios.
 */

import {
  getUsuariosByEmpresa,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario, 
} from '../models/UsuariosModel.js'

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

// Listar Usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1 // fijo en 1 para vistas
    const Usuarios = await getUsuariosByEmpresa(empresa_id)

    if (req.accepts('html')) {
      return res.render('Usuarios', { titulo: 'Gestión de Usuarios', Usuarios })
    }

    res.json(Usuarios)
  } catch (error) {
    manejarError(res, 'listarUsuarios', error)
  }
}

// Obtener Usuario
export const obtenerUsuario = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params
    const Usuario = await getUsuarioById(id, empresa_id)

    if (!Usuario) {
      if (req.accepts('html')) {
        return res.status(404).send('Usuario no encontrado')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    // 💡 PASO CLAVE: Cargamos la lista completa de Usuarios
    const Usuarios = await getUsuariosByEmpresa(empresa_id)

    if (req.accepts('html')) {
      return res.render('Usuarios', { titulo: 'Editar Usuario', Usuario, Usuarios })
    }

    res.json(Usuario)
  } catch (error) {
    manejarError(res, 'obtenerUsuario', error)
  }
}

// Crear Usuario
export const crearUsuario = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const nuevoUsuario = await createUsuario({ ...req.body, empresa_id })

    if (req.accepts('html')) {
      return res.redirect(`/api/Usuarios?empresa_id=${empresa_id}`)
    }

    // API: 201 Created
    res.status(201).json(nuevoUsuario)
  } catch (error) {
    manejarError(res, 'crearUsuario', error)
  }
}

// Actualizar Usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params

    const filasAfectadas = await updateUsuario(id, empresa_id, req.body)

    if (filasAfectadas === 0) {
      if (req.accepts('html')) {
        return res.status(404).send('Usuario no encontrado para actualizar')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado para actualizar',
      })
    }

    if (req.accepts('html')) {
      return res.redirect(`/api/Usuarios?empresa_id=${empresa_id}`)
    }

    // Opcional: devolver los datos actualizados
    const UsuarioActualizado = await getUsuarioById(id, empresa_id)
    res.json(UsuarioActualizado)
  } catch (error) {
    manejarError(res, 'actualizarUsuario', error)
  }
}

// Eliminar Usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    // Capturamos empresa_id del query string o default a 1
    const empresa_id = parseInt(req.query.empresa_id, 10) || 1

    // 1. Llama al modelo (que retorna filasAfectadas: 1 o 0)
    const filasAfectadas = await deleteUsuario(id, empresa_id)

    // 2. Verifica si la eliminación tuvo efecto
    if (filasAfectadas === 0) {
      if (req.accepts('html')) {
        return res.status(404).send('Usuario no encontrado para eliminar')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado para eliminar',
      })
    }

    // 3. Éxito:
    if (req.accepts('html')) {
      return res.redirect(`/api/Usuarios?empresa_id=${empresa_id}`)
    }

    // API: 200 OK (No Content o simple mensaje)
    res.status(200).json({
      message: 'Usuario eliminado correctamente',
      id: id,
    })
  } catch (error) {
    manejarError(res, 'eliminarUsuario', error)
  }
}
