/**
 * Archivo: ausenciasService.js
 * Descripción: Contiene la lógica de negocio para la gestión de ausencias (vacaciones, enfermedad, otros).
 */

import {  getAusenciasByEmpleado,  getAusenciaById,  createAusencia,  updateAusencia,  deleteAusencia} from '../models/ausenciasModel.js'

const TIPOS_VALIDOS = ['vacaciones', 'enfermedad', 'otros']
const ESTADOS_VALIDOS = ['pendiente', 'aprobada', 'rechazada']


// Validación de solapamiento de fechas
const haySolapamiento = (inicio1, fin1, inicio2, fin2) => {
  return inicio1 <= fin2 && inicio2 <= fin1
}


// Crear una nueva ausencia con validaciones de negocio
export const servicioRegistrarAusencia = async (data) => {
  const { empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin, estado } = data

  // Validaciones básicas
  if (!empleado_id || !empresa_id || !tipo || !fecha_inicio || !fecha_fin) {
    throw new Error('Faltan campos obligatorios (empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin)')
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new Error(`Tipo de ausencia inválido. Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`)
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(`Estado de ausencia inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`)
  }

  // Validar coherencia de fechas
  const inicio = new Date(fecha_inicio)
  const fin = new Date(fecha_fin)

  if (inicio > fin) {
    throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.')
  }

  if (fin > new Date().setFullYear(new Date().getFullYear() + 1)) {
    throw new Error('No se permiten ausencias con más de un año de anticipación.')
  }

  // Validar que no haya solapamientos con otras ausencias del mismo empleado
  const ausenciasEmpleado = await getAusenciasByEmpleado(empleado_id, empresa_id)

  const solapada = ausenciasEmpleado.find(a => 
    haySolapamiento(
      new Date(a.fecha_inicio),
      new Date(a.fecha_fin),
      inicio,
      fin
    ) && a.estado !== 'rechazada'
  )

  if (solapada) {
    throw new Error(
      `El empleado ya tiene una ausencia (${solapada.tipo}) entre ${solapada.fecha_inicio} y ${solapada.fecha_fin}.`
    )
  }

  // Crear la ausencia
  const nuevaAusencia = await createAusencia({
    empleado_id,
    empresa_id,
    tipo,
    fecha_inicio,
    fecha_fin,
    estado: estado || 'pendiente'
  })

  return nuevaAusencia
}

// Actualizar una ausencia con validaciones
export const servicioModificarAusencia = async (id, empresa_id, data) => {
  const ausenciaExistente = await getAusenciaById(id, empresa_id)
  if (!ausenciaExistente) {
    throw new Error('La ausencia no existe o pertenece a otra empresa.')
  }

  const { tipo, fecha_inicio, fecha_fin, estado } = data

  // Validar tipo y estado si se modifican
  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    throw new Error(`Tipo de ausencia inválido: ${tipo}`)
  }

  if (estado && !ESTADOS_VALIDOS.includes(estado)) {
    throw new Error(`Estado de ausencia inválido: ${estado}`)
  }

  // Validar fechas si se cambian
  if (fecha_inicio && fecha_fin) {
    const inicio = new Date(fecha_inicio)
    const fin = new Date(fecha_fin)

    if (inicio > fin) {
      throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin.')
    }

    // Revisar que no se solape con otras ausencias del empleado
    const ausenciasEmpleado = await getAusenciasByEmpleado(ausenciaExistente.empleado_id, empresa_id)
    const solapada = ausenciasEmpleado.find(a =>
      a.id !== id &&
      haySolapamiento(
        new Date(a.fecha_inicio),
        new Date(a.fecha_fin),
        inicio,
        fin
      ) && a.estado !== 'rechazada'
    )

    if (solapada) {
      throw new Error(
        `El nuevo rango de fechas se solapa con otra ausencia (${solapada.tipo}) del ${solapada.fecha_inicio} al ${solapada.fecha_fin}.`
      )
    }
  }

  // Actualizar en BD
  await updateAusencia(id, empresa_id, data)
  return await getAusenciaById(id, empresa_id)
}

// Eliminar ausencia con validaciones de negocio
export const servicioEliminarAusencia = async (id, empresa_id) => {
  const ausencia = await getAusenciaById(id, empresa_id)
  if (!ausencia) {
    throw new Error('La ausencia no existe o pertenece a otra empresa.')
  }

  // No permitir eliminar ausencias ya aprobadas o finalizadas
  if (ausencia.estado === 'aprobada') {
    throw new Error('No se puede eliminar una ausencia aprobada.')
  }

  const filas = await deleteAusencia(id, empresa_id)
  return filas
}
