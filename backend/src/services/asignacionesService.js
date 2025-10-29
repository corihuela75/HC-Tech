/**
 * Archivo: asignacionesService.js
 * Descripción: Reglas de negocio para la gestión de asignaciones de turnos.
 */

import { getAsignacionesByEmpleado, getAsignacionById, createAsignacion, updateAsignacion, deleteAsignacion } from '../models/asignacionesModel.js'

import { getTurnoById } from '../models/turnosModel.js'
import { getParametrosByEmpresa } from '../models/parametrosModel.js'

// -------------------- VALIDACIONES BÁSICAS -------------------- //

// Valida que la fecha tenga formato válido (YYYY-MM-DD)
const validarFecha = (fecha) => {
  if (!fecha || isNaN(new Date(fecha).getTime())) {
    throw new Error('La fecha de asignación no es válida.')
  }
}

// Valida si el empleado ya tiene una asignación en la misma fecha.
const validarAsignacionDuplicada = async (empleado_id, fecha) => {
  const asignaciones = await getAsignacionesByEmpleado(empleado_id)
  const yaAsignado = asignaciones.some((a) => {
    const f = new Date(a.fecha).toISOString().split('T')[0]
    return f === fecha
  })
  if (yaAsignado) {
    throw new Error('El empleado ya tiene una asignación registrada para esa fecha.')
  }
}

// Valida que las horas sean coherentes
const validarHoras = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) {
    throw new Error('Debe especificar la hora de inicio y fin.')
  }

  if (horaInicio >= horaFin) {
    throw new Error('La hora de inicio debe ser anterior a la hora de fin.')
  }
}

// Evita superposición de horarios manuales con otros del mismo empleado
const validarSolapamientoHorarios = async (empleado_id, fecha, horaInicio, horaFin) => {
  const asignaciones = await getAsignacionesByEmpleado(empleado_id)

  const inicioNueva = new Date(`${fecha}T${horaInicio}`)
  const finNueva = new Date(`${fecha}T${horaFin}`)

  for (const a of asignaciones) {
    if (!a.hora_inicio_manual || !a.hora_fin_manual) continue

    const inicioExistente = new Date(`${a.fecha}T${a.hora_inicio_manual}`)
    const finExistente = new Date(`${a.fecha}T${a.hora_fin_manual}`)

    // Chequea superposición de intervalos
    if ((inicioNueva >= inicioExistente && inicioNueva < finExistente) || (finNueva > inicioExistente && finNueva <= finExistente)) {
      throw new Error('La asignación se superpone con otro turno existente del empleado.')
    }
  }
}

// -------------------- LÓGICA DE NEGOCIO -------------------- //

// Crear una nueva asignación
export const servicioCrearAsignacion = async (asignacion) => {
  const { empleado_id, turno_id, fecha, hora_inicio_manual, hora_fin_manual, empresa_id } = asignacion

  if (!empleado_id || !fecha) {
    throw new Error('Faltan datos obligatorios (empleado_id o fecha).')
  }

  validarFecha(fecha)

  // No duplicar día
  await validarAsignacionDuplicada(empleado_id, fecha)

  // Caso 1: Asignación con turno predefinido
  if (turno_id) {
    if (!empresa_id) {
      throw new Error('Falta el parámetro empresa_id para validar el turno.')
    }

    const turno = await getTurnoById(turno_id, empresa_id)
    if (!turno) throw new Error('El turno seleccionado no existe o no pertenece a la empresa.')

    // Opcional: validar duración del turno según parámetros empresa
    if (empresa_id) {
      const parametros = await getParametrosByEmpresa(empresa_id)
      if (parametros?.jornada_max_diaria) {
        const duracionHoras = (new Date(`1970-01-01T${turno.hora_fin}`).getTime() - new Date(`1970-01-01T${turno.hora_inicio}`).getTime()) / 3600000

        if (duracionHoras > parametros.jornada_max_diaria) {
          throw new Error(`El turno excede la jornada máxima diaria (${parametros.jornada_max_diaria}h).`)
        }
      }
    }

    // Crear asignación con datos del turno
    return await createAsignacion({
      empleado_id,
      turno_id,
      fecha,
      hora_inicio_manual: turno.hora_inicio,
      hora_fin_manual: turno.hora_fin,
    })
  }

  // Caso 2: Asignación manual
  if (!hora_inicio_manual || !hora_fin_manual) {
    throw new Error('Debe seleccionar un turno o ingresar horas manuales.')
  }

  validarHoras(hora_inicio_manual, hora_fin_manual)
  await validarSolapamientoHorarios(empleado_id, fecha, hora_inicio_manual, hora_fin_manual)

  // Crear asignación manual
  return await createAsignacion({
    empleado_id,
    turno_id: null,
    fecha,
    hora_inicio_manual,
    hora_fin_manual,
  })
}

// Actualizar una asignación
export const servicioActualizarAsignacion = async (id, empleado_id, data) => {
  const asignacionActual = await getAsignacionById(id)
  if (!asignacionActual) {
    throw new Error('No se encontró la asignación a actualizar.')
  }

  const fecha = data.fecha || asignacionActual.fecha
  validarFecha(fecha)

  if (data.turno_id) {
    const turno = await getTurnoById(data.turno_id)
    if (!turno) throw new Error('El turno seleccionado no existe.')

    data.hora_inicio_manual = turno.hora_inicio
    data.hora_fin_manual = turno.hora_fin
  } else {
    validarHoras(data.hora_inicio_manual, data.hora_fin_manual)
    await validarSolapamientoHorarios(empleado_id, fecha, data.hora_inicio_manual, data.hora_fin_manual)
  }

  const filas = await updateAsignacion(id, empleado_id, data)
  if (filas === 0) {
    throw new Error('No se pudo actualizar la asignación.')
  }

  return { message: 'Asignación actualizada correctamente' }
}

// Eliminar asignación
export const servicioEliminarAsignacion = async (id, empleado_id) => {
  const asignacion = await getAsignacionById(id)
  if (!asignacion) {
    throw new Error('No se encontró la asignación a eliminar.')
  }

  const filas = await deleteAsignacion(id, empleado_id)
  if (filas === 0) {
    throw new Error('No se pudo eliminar la asignación.')
  }

  return { message: 'Asignación eliminada correctamente' }
}
