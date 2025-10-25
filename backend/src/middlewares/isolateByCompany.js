/**
 * Archivo: isolateByCompany.js
 * Middleware para inyectar el ID de la empresa en la solicitud.
 */

export const isolateByCompany = (req, res, next) => {
    // El 'authMiddleware.js' ya verificó el token y si es Super-Admin.

    // 1. Verificar si el usuario fue adjuntado
    if (!req.user) {
        return res.status(401).json({ message: 'Error de autenticación: usuario no encontrado.' });
    }

    // 2. Obtener el ID de la empresa.
    // Asumimos que el Super-Admin NO tendrá un empresa_id, o si lo tiene, será manejado por el controlador.
    const empresa_id = req.user.empresa_id;

    // 3. Si NO hay empresa_id, el usuario NO puede operar con datos de empresa. 
    //    (A menos que el controlador decida qué hacer con un Super-Admin sin empresa_id).
    if (!empresa_id && req.user.rol !== 'superadmin') { // <-- Mantenemos la comprobación solo para este caso límite.
         return res.status(403).json({ 
             message: 'Acceso denegado. El usuario no tiene una empresa asignada.' 
         });
    }

    // 4. Si es Super-Admin o si tiene empresa_id, continuamos.
    //    Adjuntamos el ID de la empresa (será undefined para Super-Admin sin empresa_id)
    req.empresaId = empresa_id;

    // 5. Solución al TypeError (inicializar req.body)
    if (!req.body) {
        req.body = {};
    }

    // 6. Inyectamos el ID en el cuerpo si existe
    req.body.empresaId = empresa_id; 

    next();
};