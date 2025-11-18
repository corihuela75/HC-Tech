import { empleadoById, getEmpleadoById } from '../models/empleadosModel.js'
import { cerrarTramite, crearTramite, deleteTramite, obtenerTotalTramites, obtenerTramiteById, obtenerTramitesByUser, tomarTramite } from '../models/tramitesModel.js'
import { getUsuarioByEmail, getUsuarioByEmpleadoId, getUsuarioById } from '../models/UsuariosModel.js'
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
export const listarTramitesController = async (req, res) => {
  try {
    const { empleado_id, empresa_id } = req.body
    const empleado = await empleadoById(empleado_id);
    const user = await getUsuarioByEmail(empleado.email);
    let response;
    if (!!user.rol && ['admin', 'superadmin'].includes(user.rol)) {
      response = await obtenerTotalTramites(empresa_id)
    } else {
      response = await obtenerTramitesByUser(empresa_id, empleado_id)
    }
    res.status(200).json(response)
  } catch (error) {
    manejarError(res, 'listarTramites', error)
  }
}

// Crear tramite
export const crearTramiteController = async (req, res) => {
  try {
    const id = await crearTramite(req.body)
    
const tramite = await obtenerTramiteById(id)
    res.json(tramite)
  } catch (error) {
    manejarError(res, 'crearTramite', error)
  }
}

// Actualizar tramite
export const tomarTramiteController = async (req, res) => {
  try {
    const { id, encargado } = req.body
    if (!(id && encargado)) {
      throw new Error('Campos faltantes')
    }
    
    const user = await getUsuarioByEmpleadoId(encargado);
    if (!user.rol || !['admin', 'superadmin'].includes(user.rol)) {
        res.status(401).message("No posee permisos")
    }

    const resultado = await tomarTramite(req.body)
    if (!resultado) throw new Error('No se pudo actualizar Tramite')

    const tramite = await obtenerTramiteById(id)
    res.json(tramite)
  } catch (error) {
    manejarError(res, 'actualizarTramite', error)
  }
}
export const cerrarTramiteController = async (req, res) => {
  try {
    const { id, devolucion, estado, fecha_inicio, fecha_fin } = req.body;

    if (!(id && devolucion && estado)) {
      throw new Error('Campos faltantes')
    }

    const resultado = await cerrarTramite(req.body)
    if (!resultado) throw new Error('No se pudo actualizar Tramite')

      const tramite = await obtenerTramiteById(id)

      const { empleado_id, empresa_id, asunto} = tramite;
      const request = {empleado_id, empresa_id, tipo:asunto, fecha_inicio, fecha_fin, estado }
      if(['Vacaciones','Día libre','Enfermedad','Licencia','Capacitación'].includes(asunto)) {
        await servicioRegistrarAusencia(request);
      }

    res.json(tramite)
  } catch (error) {
    manejarError(res, 'actualizarTramite', error)
  }
}

// Eliminar tramite
export const eliminarTramiteController = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    await deleteTramite(id)

    res.status(200).json({ message: 'Turno eliminado correctamente', id })
  } catch (error) {
    manejarError(res, 'eliminarTramite', error)
  }
}
