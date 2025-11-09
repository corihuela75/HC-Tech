    /**
 * Archivo: marcajesService.js
 * Descripción: Contiene la lógica de negocio para la gestión de marcajes (entradas/salidas).
 */

import {
  getMarcajesByEmpleado,
  getMarcajeById,
  createMarcaje,
  updateMarcaje,
  deleteMarcaje,
  updateSalidaMarcaje,
  updateEntradaMarcaje
} from '../models/marcajesModel.js'

// Validación: tipos de marcaje válidos
const TIPOS_VALIDOS = ['entrada', 'salida']

// Valida y crea un nuevo marcaje
export const servicioRegistrarMarcaje = async (data) => {
  const { empleado_id, empresa_id, tipo, fecha_hora, metodo } = data

  // Validaciones básicas
  if (!empleado_id || !empresa_id || !tipo) {
    throw new Error('Faltan campos obligatorios (empleado_id, empresa_id o tipo)')
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw new Error(`Tipo de marcaje inválido: debe ser uno de ${TIPOS_VALIDOS.join(', ')}`)
  }

  // Validar duplicidad o incoherencia lógica
  const marcajesEmpleado = await getMarcajesByEmpleado(empleado_id, empresa_id)
  const ultimoMarcaje = marcajesEmpleado[0] // el más reciente (por fecha_hora DESC)

  if (ultimoMarcaje) {
    // Evitar marcar dos veces seguidas el mismo tipo (dos "entradas" seguidas, por ejemplo)
    if (ultimoMarcaje.tipo === tipo) {
      throw new Error(
        `Ya existe un marcaje de tipo "${tipo}" consecutivo. Debe registrar un marcaje de tipo "${tipo === 'entrada' ? 'salida' : 'entrada'}" antes.`
      )
    }

    // Validar orden temporal
    const fechaActual = new Date(fecha_hora || new Date())
    const fechaUltima = new Date(ultimoMarcaje.fecha_hora)
    if (fechaActual < fechaUltima) {
      throw new Error('La fecha/hora del marcaje no puede ser anterior al último registrado.')
    }
  }

  // Crear el marcaje si pasa las validaciones
  const nuevoMarcaje = await createMarcaje({
    empleado_id,
    empresa_id,
    tipo,
    fecha_hora: fecha_hora || new Date(),
    metodo: metodo || 'web'
  })

  return nuevoMarcaje
}

const validateDate = (date,init) => {
    const hours = init.split(":")[0];
    const newDate = new Date(date)
    newDate.setHours(Number(hours), 0, 0, 0);
    return new Date() >= newDate
}

export const servicioCrearMarcaje = async (data) => {
  const { dia, hora_inicio } = data

    if (validateDate(dia,hora_inicio)) {
      throw new Error('La fecha/hora del marcaje no puede ser anterior a hoy.')
    }

  // Crear el marcaje si pasa las validaciones
  const nuevoMarcaje = await createMarcaje(data)

  return nuevoMarcaje;
}


// Valida y asctualiza un marcaje existente
export const servicioModificarMarcaje = async (id, empresa_id, data) => {
  const marcajeExistente = await getMarcajeById(id, empresa_id)
  if (!marcajeExistente) {
    throw new Error('El marcaje no existe o pertenece a otra empresa.')
  }

  // Validar tipo si lo envían
  if (data.tipo && !TIPOS_VALIDOS.includes(data.tipo)) {
    throw new Error(`Tipo de marcaje inválido: ${data.tipo}`)
  }

  // Validar fecha coherente (no futura)
  if (data.fecha_hora) {
    const fecha = new Date(data.fecha_hora)
    if (fecha > new Date()) {
      throw new Error('La fecha/hora no puede ser futura.')
    }
  }

  await updateMarcaje(id, empresa_id, data)
  return await getMarcajeById(id, empresa_id)
}

export const servicioRegistrarEntrada = async (data) => {

  const {entrada} = data;
  data.entrada = new Date(entrada);
    return await updateEntradaMarcaje(data)
}

export const servicioRegistrarSalida = async (data) => {
  const {salida} = data;
  data.salida = new Date(salida);

    return await updateSalidaMarcaje(data)
}


// Valida y elimina un marcaje existente
export const servicioEliminarMarcaje = async (id, empresa_id) => {
  const marcaje = await getMarcajeById(id)
  if (!marcaje) {
    throw new Error('El marcaje no existe o no pertenece a la empresa.')
  }

  // no eliminar marcajes antiguos)
//   const fechaMarcaje = new Date(marcaje.fecha_hora)
//   const limite = new Date()
//   limite.setDate(limite.getDate() - 7) // no eliminar marcajes con más de 7 días
//   if (fechaMarcaje < limite) {
//     throw new Error('No se pueden eliminar marcajes con más de 7 días de antigüedad.')
//   }

  const filas = await deleteMarcaje(id)
  return filas
}
