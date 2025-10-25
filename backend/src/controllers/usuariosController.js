/**
 * Archivo: usuariosController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de usuarios.
 */

import { getUsuariosByEmpresa, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, getUsuarioByEmail } from '../models/UsuariosModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

const esPeticionAPI = (req) => {
  const accept = req.headers.accept || ''
  const userAgent = req.headers['user-agent'] || ''

  // Si pide JSON explícitamente o NO parece un navegador → API
  return accept.includes('application/json') || !userAgent.includes('Mozilla')
}

// Listar Usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const empresa_id = req.empresaId;
    const usuarios = await getUsuariosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('Usuarios', { titulo: 'Gestión de Usuarios', usuarios })
    }

    res.json(usuarios)
  } catch (error) {
    manejarError(res, 'listarUsuarios', error)
  }
}

// Obtener Usuario
export const obtenerUsuario = async (req, res) => {
  try {
    const empresa_id = req.empresaId;
    const { id } = req.params
    const usuario = await getUsuarioById(id, empresa_id)

    if (!usuario) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Usuario no encontrado')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado',
      })
    }

    // 💡 PASO CLAVE: Cargamos la lista completa de Usuarios
    const usuarios = await getUsuariosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('Usuarios', { titulo: 'Editar Usuario', usuario, usuarios })
    }

    res.json(usuario)
  } catch (error) {
    manejarError(res, 'obtenerUsuario', error)
  }
}

// Crear Usuario
export const crearUsuario = async (req, res) => {
  try {
    const empresa_id = req.empresaId; 
    const nuevoUsuario = await createUsuario({ ...req.body, empresa_id })

    if (!esPeticionAPI(req)) {
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
    const empresa_id = req.empresaId; 
    const { id } = req.params

    const filasAfectadas = await updateUsuario(id, empresa_id, req.body)

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Usuario no encontrado para actualizar')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado para actualizar',
      })
    }

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/Usuarios?empresa_id=${empresa_id}`)
    }

    // Opcional: devolver los datos actualizados
    const usuarioActualizado = await getUsuarioById(id, empresa_id)
    res.json(usuarioActualizado)
  } catch (error) {
    manejarError(res, 'actualizarUsuario', error)
  }
}

// Eliminar Usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const empresa_id = req.empresaId;

    // 1. Llama al modelo (que retorna filasAfectadas: 1 o 0)
    const filasAfectadas = await deleteUsuario(id, empresa_id)

    // 2. Verifica si la eliminación tuvo efecto
    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Usuario no encontrado para eliminar')
      }
      return res.status(404).json({
        message: 'Usuario no encontrado para eliminar',
      })
    }

    // 3. Éxito:
    if (!esPeticionAPI(req)) {
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

// Login Usuario

const JWT_SECRET = process.env.JWT_SECRET

// Mostrar formulario de login
export const mostrarLogin = (req, res) => {
  res.render('Login', { titulo: 'Login de Usuarios' })
}

// Procesar login
export const procesarLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    const isApiCall = req.get('User-Agent')?.includes('Thunder') || req.get('User-Agent')?.includes('Postman')
    const user = await getUsuarioByEmail(email)

    // 1: Usuario no encontrado

    if (!user) {
      if (isApiCall) {
        return res.status(401).json({ error: 'Usuario no encontrado' })
      }
      return res.status(401).render('Login', { error: 'Usuario no encontrado' })
    }

    // 2: Verificar contraseña

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      if (isApiCall) {
        return res.status(401).json({ error: 'Contraseña incorrecta' })
      }
      return res.status(401).render('Login', { error: 'Contraseña incorrecta' })
    }

    // 3: Crear token JWT
    const token = jwt.sign(
      {
        id: user.id,
        empresa_id: user.empresa_id,
        rol: user.rol,
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    )

    // 4: RESPUESTA: Según el tipo de cliente

    if (isApiCall) {
      // Si viene de Thunder/Postman → devolver JSON
      return res.json({
        message: 'Login exitoso',
        token,
        usuario: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          empresa_id: user.empresa_id,
          rol: user.rol,
        },
      })
    }

    // Si viene de navegador → guardar cookie y redirigir
    res.cookie('token', token, {
      httpOnly: true, // JS no puede leerla
      secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
      sameSite: 'strict', // protege contra CSRF
      maxAge: 2 * 60 * 60 * 1000, // 2 horas en milisegundos (coincide con JWT)
    })

    return res.render('dashboard', {
      titulo: 'Panel de control',
      usuario: user.nombre,
      rol: user.rol,
    })
    
  } catch (error) {
    console.error('Error en login:', error)

    // Manejo de errores internos del servidor
    if (isApiCall) {
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
    return res.status(500).render('Login', { error: 'Error interno del servidor' })
  }
}

// Logout Usuario
export const logoutUsuario = (req, res) => {
  res.clearCookie('token') // elimina la cookie del JWT
  res.redirect('/api/usuarios/login')    // redirige al login
}