import { crearCalendario, deleteCalendarioItem, obtenerCalendarioById, obtenerCalendarioByUser } from '../models/calendarioModel.js'

const manejarError = (res, funcion, error) => {
  console.error(`Error en ${funcion}:`, error.message || error)
  if (!res.headersSent && !res.req.accepts('html')) {
    return res.status(500).json({ error: `Error al procesar la solicitud en ${funcion}` })
  }
  if (!res.headersSent) {
    return res.status(500).send(`Error al procesar la solicitud en ${funcion}`)
  }
}

// Listar tramit
export const listarCalendarioController = async (req, res) => {
  try {
      let response = await obtenerCalendarioByUser(req.body)
    
    res.status(200).json(response)
  } catch (error) {
    manejarError(res, 'listarCalendario', error)
  }
}

// Crear tramite
export const crearCalendarioController = async (req, res) => {
  try {
    const id = await crearCalendario(req.body)
    const item = await obtenerCalendarioById(id);

    res.status(200).json(item)
  } catch (error) {
    manejarError(res, 'crearTramite', error)
  }
}


// Eliminar tramite
export const eliminarCalendarioItemController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    await deleteCalendarioItem(id)

    res.status(200).json({ message: 'Turno eliminado correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarTramite', error)
  }
}
