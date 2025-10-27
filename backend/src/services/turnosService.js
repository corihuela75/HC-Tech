/**
 * Archivo: turnosService.js
 * Descripción: Lógica de negocio y validaciones para los turnos de empresa.
 */
import { createTurno, updateTurno } from '../models/turnosModel.js'
import { servicioObtenerParametros } from './parametrosService.js'

// Convierte "HH:MM" a minutos desde medianoche
const horaAMinutos = (horaStr) => {
  const [h, m] = horaStr.split(':').map(Number)
  return h * 60 + m
}
// Convierte minutos a horas decimales
const minutosAHoras = (minutos) => minutos / 60

// Servicio para crear o actualizar un turno con validaciones
export const guardarTurno = async ({ id, empresa_id, nombre, hora_inicio, hora_fin }) => {
  console.log('Validando turno:', { id, empresa_id, nombre, hora_inicio, hora_fin })

  // Validación de formato
  hora_inicio = hora_inicio.trim()
  hora_fin = hora_fin.trim()

  const regexHora = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/

  if (!regexHora.test(hora_inicio) || !regexHora.test(hora_fin)) {
    return { error: 'Hora de inicio o fin inválida' }
  }
  // Convertir a minutos para cálculos
  let inicioMin = horaAMinutos(hora_inicio)
  let finMin = horaAMinutos(hora_fin)

  // Manejar turnos nocturnos (cruzan medianoche)
  if (finMin <= inicioMin) {
    finMin += 24 * 60
  }

  // Obtener parámetros de la empresa
  const parametros = await servicioObtenerParametros(empresa_id)
  if (!parametros) return { error: 'No se encontraron parámetros para la empresa' }

  // Validar duración
  const duracion = finMin - inicioMin // en minutos
  const duracionHrs = minutosAHoras(duracion)

  if (duracion < 30) return { error: 'El turno es demasiado corto (<30 min)' }

  if (duracion > 12 * 60) return { error: 'El turno excede la duración máxima (12 horas)' }

  if (duracionHrs > parametros.jornada_max_diaria) {
    return { error: 'La jornada diaria excede el máximo permitido' }
  }

  // if (!parametros.permite_horas_extras && extras > 0) {
  //   return { error: 'No se permiten horas extras' }
  // }

  // if (extras > parametros.max_horas_extras_diarias) {
  //   return { error: 'Las horas extras diarias exceden el máximo permitido' }
  // }

  // Guardar turno usando el modelo
  let turnoGuardado
  if (id) {
    const filas = await updateTurno(id, empresa_id, { nombre, hora_inicio, hora_fin })
    if (filas === 0) return { error: 'No se pudo actualizar el turno' }
    turnoGuardado = { id, empresa_id, nombre, hora_inicio, hora_fin }
  } else {
    turnoGuardado = await createTurno({ empresa_id, nombre, hora_inicio, hora_fin })
  }

  return { data: turnoGuardado }
}
