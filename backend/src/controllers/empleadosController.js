/**
 * Archivo: empleadosController.js
 * Descripción: Controlador para gestionar las operaciones CRUD de empleados.
 */

import {
  getEmpleadosByEmpresa,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getStaticsByEmployeeId, // ¡Importamos la función limpia del modelo!
} from '../models/empleadosModel.js'
import { getUsuarioByEmail, getUsuarioById, updateUsuarioEmpleadoId } from '../models/UsuariosModel.js'

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

// Listar empleados
export const listarEmpleados = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1 // fijo en 1 para vistas
    const empleados = await getEmpleadosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('empleados', { titulo: 'Gestión de Empleados', empleados })
    }

    res.json(empleados)
  } catch (error) {
    manejarError(res, 'listarEmpleados', error)
  }
}

// Obtener empleado
export const obtenerEstadisticas = async (req, res) => {
  try {
    const {empresa_id = 1 , empleado_id} = req.body;
    const statics = await getStaticsByEmployeeId(empleado_id, empresa_id);

    res.json(statics)
  } catch (error) {
    manejarError(res, 'obtenerEstadisticas', error)
  }
}

// Obtener empleado
export const obtenerEmpleado = async (req, res) => {
  try {
    const empresa_id = req.query.empresa_id || 1
    const { id } = req.params
    const empleado = await getEmpleadoById(id, empresa_id)

    if (!empleado) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Empleado no encontrado')
      }
      return res.status(404).json({
        message: 'Empleado no encontrado',
      })
    }

    // 💡 PASO CLAVE: Cargamos la lista completa de empleados
    const empleados = await getEmpleadosByEmpresa(empresa_id)

    if (!esPeticionAPI(req)) {
      return res.render('empleados', { titulo: 'Editar Empleado', empleado, empleados })
    }

    res.json(empleado)
  } catch (error) {
    manejarError(res, 'obtenerEmpleado', error)
  }
}

// Crear empleado
export const crearEmpleado = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const nuevoEmpleado = await createEmpleado(req.body)

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/empleados?empresa_id=${req.body.empresa_id}`)
    }

    const user = await getUsuarioById(id);
    if(user.email === req.body.email ){
      await updateUsuarioEmpleadoId(nuevoEmpleado.id, user.id);
    }
    

    // API: 201 Created
    res.status(201).json(nuevoEmpleado)
  } catch (error) {
    manejarError(res, 'crearEmpleado', error)
  }
}

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {

    const {id, empresa_id} = req.body;
    const filasAfectadas = await updateEmpleado(req.body);

    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Empleado no encontrado para actualizar')
      }
      return res.status(404).json({
        message: 'Empleado no encontrado para actualizar',
      })
    }
    const user = await getUsuarioByEmail(req.body.email);

    await updateUsuarioEmpleadoId(user.id, user.empleado_id, req.body);

    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/empleados?empresa_id=${empresa_id}`)
    }

    // Opcional: devolver los datos actualizados
    const empleadoActualizado = await getEmpleadoById(id, empresa_id)
    res.json(empleadoActualizado)
  } catch (error) {
    manejarError(res, 'actualizarEmpleado', error)
  }
}

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)

    // 1. Llama al modelo (que retorna filasAfectadas: 1 o 0)
    const filasAfectadas = await deleteEmpleado(id)

    // 2. Verifica si la eliminación tuvo efecto
    if (filasAfectadas === 0) {
      if (!esPeticionAPI(req)) {
        return res.status(404).send('Empleado no encontrado para eliminar')
      }
      return res.status(404).json({
        message: 'Empleado no encontrado para eliminar',
      })
    }

    // 3. Éxito:
    if (!esPeticionAPI(req)) {
      return res.redirect(`/api/empleados?empresa_id=${empresa_id}`)
    }

    // API: 200 OK (No Content o simple mensaje)
    res.status(200).json({
      message: 'Empleado eliminado correctamente',
      id: id,
    })
  } catch (error) {
    manejarError(res, 'eliminarEmpleado', error)
  }
}
