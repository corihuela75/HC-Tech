import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  //console.log('Usuario verificado:', token)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // guarda los datos del usuario en la request
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}