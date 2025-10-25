/**
 * Archivo: localsMiddleware.js
 * Descripción: Middleware para decodificar JWT y exponer datos del usuario a las vistas Pug (res.locals).
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en variables de entorno')
}

// Este middleware debe ejecutarse ANTES de CUALQUIER renderizado de vista.
const cargarUsuarioParaVistas = (req, res, next) => {
    let token;
    
    // 1. Obtener Token de la cabecera o de las cookies (igual que en authMiddleware)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    // Inicializa las variables de Pug a null/default
    res.locals.nombre = 'Usuario';
    res.locals.rol = 'sin rol';

    if (!token) {
        // No hay token, continúa con los valores por defecto
        return next(); 
    }

    try {
        // Decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 2. Asignar los valores del payload decodificado a res.locals
        // Asumiendo que tu payload JWT tiene las propiedades 'nombre' y 'rol'.
        res.locals.nombre = decoded.nombre || 'Usuario';
        res.locals.rol = decoded.rol || 'sin rol';
        
        // Opcional: Adjuntar el usuario al request si aún no lo has hecho
        req.user = decoded; 

    } catch (err) {
        // En caso de error (token expirado/inválido), limpiar la cookie y usar los valores por defecto
        res.clearCookie('token');
        res.locals.nombre = 'Invitado';
        res.locals.rol = 'sin rol';
    }

    next();
};

export default cargarUsuarioParaVistas;