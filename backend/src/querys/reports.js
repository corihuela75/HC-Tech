export const reportQuery = `
WITH RECURSIVE dias_mes AS (
SELECT CAST(DATE_FORMAT(?, '%Y-%m-01') AS DATE) as dia
    UNION ALL
    SELECT DATE_ADD(dia, INTERVAL 1 DAY)
    FROM dias_mes
    WHERE dia < LAST_DAY(DATE_FORMAT(?, '%Y-%m-01'))
),
ausencias_data AS (
    SELECT 
        a.fecha_inicio,
        a.fecha_fin,
        a.tipo,
        CASE 
            WHEN a.tipo = 'Vacaciones' THEN 1 ELSE 0 
        END as vacaciones,
        CASE 
            WHEN a.tipo = 'Día libre' THEN 1 ELSE 0 
        END as dia_libre,
        CASE 
            WHEN a.tipo = 'Enfermedad' THEN 1 ELSE 0 
        END as enfermedad,
        CASE 
            WHEN a.tipo = 'Licencia' THEN 1 ELSE 0 
        END as licencia,
        CASE 
            WHEN a.tipo = 'Capacitación' THEN 1 ELSE 0 
        END as capacitacion
    FROM ausencias a
    WHERE a.empleado_id = ? 
      AND a.estado = 'Aprobado'
      AND (
        (a.fecha_inicio <= LAST_DAY(DATE_FORMAT(?, '%Y-%m-01')) AND a.fecha_fin >= DATE_FORMAT(?, '%Y-%m-01'))
      )
),
marcajes_data AS (
    SELECT 
        m.dia,
        m.hora_inicio,
        m.hora_fin,
        m.entrada,
        m.salida,
        CASE 
            WHEN m.entrada IS NOT NULL AND m.salida IS NOT NULL THEN
                GREATEST(0, LEAST(100, 
                    (TIMESTAMPDIFF(MINUTE, m.entrada, m.salida) * 100.0) / 
                    NULLIF(TIMESTAMPDIFF(MINUTE, m.hora_inicio, m.hora_fin), 0)
                ))
            ELSE 0
        END as porcentaje_asistido
    FROM marcajes m
    WHERE m.empleado_id = ? 
      AND m.dia BETWEEN DATE_FORMAT(?, '%Y-%m-01') AND LAST_DAY(DATE_FORMAT(?, '%Y-%m-01'))
)
SELECT 
    ? as empleado_id,
    dm.dia,
    JSON_OBJECT(
        'dia_libre', COALESCE(MAX(ad.dia_libre), 0),
        'asistido', COALESCE(MAX(md.porcentaje_asistido), 0),
        'vacaciones', COALESCE(MAX(ad.vacaciones), 0),
        'ausencia', 100 - COALESCE(MAX(md.porcentaje_asistido), 100),
        'licencia', COALESCE(MAX(ad.licencia), 0),
        'enfermedad', COALESCE(MAX(ad.enfermedad), 0),
        'capacitación', COALESCE(MAX(ad.capacitacion), 0)
    ) as data
FROM dias_mes dm
LEFT JOIN ausencias_data ad ON dm.dia BETWEEN ad.fecha_inicio AND ad.fecha_fin
LEFT JOIN marcajes_data md ON dm.dia = md.dia
GROUP BY dm.dia
ORDER BY dm.dia;
`;