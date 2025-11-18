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
    a.fecha_inicio,
    a.fecha_fin,
    CASE 
        WHEN e.fecha_egreso IS NOT NULL THEN 'Inactivo'
        WHEN a.id IS NOT NULL AND CURDATE() BETWEEN a.fecha_inicio AND a.fecha_fin THEN 'Vacaciones'
        WHEN EXISTS (
            SELECT 1 FROM marcajes m 
            WHERE m.empleado_id = e.id 
            AND DATE(m.dia) = CURDATE()
            AND m.entrada IS NOT NULL
            AND (m.salida IS NULL OR m.salida = '')
        ) THEN 'Activo'
        ELSE 'Ausente'
    END as estado
FROM empleados e
LEFT JOIN ausencias a ON (
    a.empleado_id = e.id 
    AND a.tipo = 'Vacaciones' 
    AND a.estado = 'Aprobado'
    AND CURDATE() BETWEEN a.fecha_inicio AND a.fecha_fin
)
WHERE e.empresa_id = ?;`;