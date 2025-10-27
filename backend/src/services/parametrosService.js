/**
 * Archivo: parametrosService.js
 * Descripción: Lógica de negocio y validaciones para los parámetros de empresa.
 */

import {
  getParametrosByEmpresa,
  createParametros,
  updateParametros,
  deleteParametros
} from '../models/parametrosModel.js'


// Validaciones de negocio


// Validación de valores de parámetros
export const validarParametros = (data) => {
  const errores = []

  if (data.jornada_max_diaria <= 0)
    errores.push('La jornada máxima diaria debe ser mayor a 0.')
  if (data.jornada_max_semanal <= 0)
    errores.push('La jornada máxima semanal debe ser mayor a 0.')
  if (data.jornada_max_nocturna > data.jornada_max_diaria)
    errores.push('La jornada nocturna no puede ser mayor a la diaria.')
  if (data.horas_nocturnas_inicio === data.horas_nocturnas_fin)
    errores.push('La hora de inicio y fin nocturna no pueden ser iguales.')
  if (data.max_horas_extras_diarias > data.max_horas_extras_semanales)
    errores.push('Las horas extras diarias no pueden superar las semanales.')
  if (data.tiempo_descanso_minimo < 8)
    errores.push('El tiempo de descanso mínimo no puede ser menor a 8 horas.')

  return errores
}

// Verifica que los campos requeridos estén presentes
const validarCampos = (data) => {
  const requeridos = [
    'jornada_max_diaria',
    'jornada_max_semanal',
    'horas_nocturnas_inicio',
    'horas_nocturnas_fin'
  ]
  const faltantes = requeridos.filter(campo => data[campo] === undefined || data[campo] === null)

  if (faltantes.length > 0) {
    throw new Error(`Faltan campos requeridos: ${faltantes.join(', ')}`)
  }
}


// Servicios


// Obtener parámetros de una empresa
export const servicioObtenerParametros = async (empresa_id) => {
  if (!empresa_id) throw new Error('El parámetro empresa_id es obligatorio')

  const parametros = await getParametrosByEmpresa(empresa_id)
  if (!parametros) throw new Error('No se encontraron parámetros para esta empresa')

  return parametros
}

// Crear parámetros para una empresa
export const servicioCrearParametros = async (data) => {
  if (!data.empresa_id) throw new Error('El parámetro empresa_id es obligatorio')

  const existentes = await getParametrosByEmpresa(data.empresa_id)
  if (existentes) throw new Error('Los parámetros de esta empresa ya existen')

  validarCampos(data)

  const errores = validarParametros(data)
  if (errores.length > 0) throw new Error(errores.join(' '))

  const nuevo = await createParametros(data)
  return nuevo
}

// Actualizar parámetros
export const servicioActualizarParametros = async (empresa_id, data) => {
  
   data = {
    jornada_max_diaria: Number(data.jornada_max_diaria),
    jornada_max_semanal: Number(data.jornada_max_semanal),
    horas_nocturnas_inicio: data.horas_nocturnas_inicio,
    horas_nocturnas_fin: data.horas_nocturnas_fin,
    jornada_max_nocturna: Number(data.jornada_max_nocturna),
    jornada_max_insalubre: Number(data.jornada_max_insalubre),
    permite_horas_extras: Number(data.permite_horas_extras),
    max_horas_extras_diarias: Number(data.max_horas_extras_diarias),
    max_horas_extras_semanales: Number(data.max_horas_extras_semanales),
    tiempo_descanso_minimo: Number(data.tiempo_descanso_minimo)
  }


  if (!empresa_id) throw new Error('El parámetro empresa_id es obligatorio')

  validarCampos(data)

  const existente = await getParametrosByEmpresa(empresa_id)
  if (!existente) throw new Error('No existen parámetros para actualizar')

  const errores = validarParametros(data)
  if (errores.length > 0) throw new Error(errores.join(' '))

  const actualizado = await updateParametros(empresa_id, data)
  if (!actualizado) throw new Error('No se pudieron actualizar los parámetros')

  return actualizado
}

// Eliminar parámetros
export const servicioEliminarParametros = async (empresa_id) => {
  if (!empresa_id) throw new Error('El parámetro empresa_id es obligatorio')

  const existente = await getParametrosByEmpresa(empresa_id)
  if (!existente) throw new Error('No existen parámetros para eliminar')

  const eliminado = await deleteParametros(empresa_id)
  return eliminado
}