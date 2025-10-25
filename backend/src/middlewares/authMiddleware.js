/**
 * Archivo: authMiddleware.js
 * Descripción: Middleware para verificar el token JWT y el rol del usuario.
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en variables de entorno')
}
export const verificarTokenYRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    let token
    const authHeader = req.headers.authorization
    // 1. Obtener Token de la cabecera o de las cookies
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    } else if (req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded // Adjuntamos el payload decodificado (incluye id, empresa_id, rol)

      // 1. Verificar EXCEPCIÓN: Si es Super-Admin, tiene acceso inmediato.
      if (decoded.rol === 'superadmin') {
        return next()
      }

      // 2. Si no es Super-Admin, verificar si su rol está en la lista de permitidos.

      // CASO A: Hay roles definidos. Comprueba si el rol del usuario NO está incluido.
      const rolesPermitidosDefinidos = rolesPermitidos.length > 0

      if (rolesPermitidosDefinidos && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' })
      }

      // CASO B: NO hay roles definidos (rolesPermitidos.length === 0).
      // Si no es Super-Admin (ya lo comprobamos arriba), y no hay ningún rol listado, DEBEMOS BLOQUEAR.
      if (!rolesPermitidosDefinidos) {
        // Si la lista está vacía Y el usuario no era Super-Admin (ya salió en el paso 1),
        // entonces nadie más tiene permiso.
        return res.status(403).json({ message: 'Acceso denegado: solo Super-Admin' })
      }

      // 3. Si el rol es permitido, continuamos.
      next()
    } catch (err) {
      console.error('Error al verificar token:', err.message)
      return res.status(401).json({ message: 'Token inválido o expirado' })
    }
  }
}
