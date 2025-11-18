import { empleadoById, getEmpleadoById } from '../models/empleadosModel.js'
import { getReportById } from '../models/reportesModel.js'
import { cerrarTramite, crearTramite, deleteTramite, obtenerTotalTramites, obtenerTramiteById, obtenerTramitesByUser, tomarTramite } from '../models/tramitesModel.js'
import { getUsuarioById } from '../models/UsuariosModel.js'
import { servicioRegistrarAusencia } from '../services/ausenciasServices.js'

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
export const obtenerReporteController = async (req, res) => {
  try {
    let response = await getReportById(req.body);
    response = response.map((i)=>({...i,data:JSON.parse(i.data)}) )
    res.status(200).json(response)
  } catch (error) {
    manejarError(res, 'listarTramites', error)
  }
}

