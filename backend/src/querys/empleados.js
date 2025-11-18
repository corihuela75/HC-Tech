export const get_statics = `
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN m.entrada IS NOT NULL THEN 1 ELSE 0 END) as dias_asistidos,
    SUM(CASE WHEN m.entrada IS NOT NULL AND m.entrada <= m.hora_inicio THEN 1 ELSE 0 END) as dias_puntuales
FROM marcajes m
WHERE m.empleado_id = ? 
    AND m.empresa_id = ?;`

    
    export const listarEmpleadosQuery = `
SELECT 
    e.*,
    CASE 
        WHEN e.fecha_egreso IS NOT NULL THEN 'Inactivo'
        WHEN EXISTS (
            SELECT 1 FROM ausencias a 
            WHERE a.empleado_id = e.id 
            AND a.tipo = 'vacaciones' 
            AND a.estado = 'aprobada'
            AND CURDATE() BETWEEN a.fecha_inicio AND a.fecha_fin
        ) THEN 'Vacaciones'
        
        WHEN EXISTS (
            SELECT 1 FROM marcajes m 
            WHERE m.empleado_id = e.id 
            AND TIME(NOW()) > m.hora_inicio
            AND m.entrada IS NOT NULL
        ) THEN 'Activo'
        
        ELSE 'Ausente'
    END as estado
FROM empleados e
WHERE empresa_id = ?;`