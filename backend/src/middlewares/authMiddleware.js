import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en variables de entorno')
}

/**
 * Middleware para verificar token y roles permitidos
 * @param {...string} rolesPermitidos - lista de roles que pueden acceder a la ruta
 */
export const verificarTokenYRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    let token
    const authHeader = req.headers.authorization
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
      req.user = decoded

      // Verificar rol
      if (rolesPermitidos.length && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' })
      }

      next()
    } catch (err) {
      console.error('Error al verificar token:', err.message)
      return res.status(401).json({ message: 'Token inválido o expirado' })
    }
  }
}


// Cómo usarlo en rutas
// Ruta solo para administradores:
// app.get('/api/admin', verificarTokenYRol('admin'), (req, res) => {
//   res.json({ message: `Hola ${req.user.id}, eres admin!` })
// })

// Ruta para admin y empleado:
// app.get('/api/usuarios', verificarTokenYRol('admin', 'empleado'), (req, res) => {
//   res.json({ message: `Hola ${req.user.id}, puedes acceder a esta ruta!` })