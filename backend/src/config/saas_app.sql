-- Crear base de datos
CREATE DATABASE IF NOT EXISTS saas_app;

USE saas_app;

-- ==============================
-- 1. Tabla empresas
-- ==============================
CREATE TABLE
    IF NOT EXISTS empresas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        pag_web VARCHAR(150) DEFAULT NULL,
        direccion VARCHAR(255) DEFAULT NULL,
        razon_social VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(150) DEFAULT NULL,
        telefono VARCHAR(50) DEFAULT NULL,
        cuit VARCHAR(20) UNIQUE,
    );

-- ==============================
-- 2. Tabla usuarios (admins, empleados con acceso al sistema)
-- ==============================
CREATE TABLE
    usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL, -- hashed
        rol ENUM ('superadmin', 'admin', 'empleado') DEFAULT 'empleado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 3. Tabla empleados
-- ==============================
CREATE TABLE
    empleados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        direccion VARCHAR(255) DEFAULT NULL,
        fecha_nac DATE,
        turno VARCHAR(50) NOT NULL, -- Ej: "Mañana", "Tarde", "Noche"
        dni VARCHAR(20) UNIQUE,
        puesto VARCHAR(100),
        fecha_ingreso DATE,
        fecha_egreso DATE DEFAULT NULL,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 4. Tabla turnos predefinidos
-- ==============================
CREATE TABLE
    turnos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id INT NOT NULL,
        nombre VARCHAR(50) NOT NULL, -- Ej: "Mañana", "Tarde", "Noche"
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 5. Tabla asignación de turnos (empleados)
-- ==============================
CREATE TABLE
    asignaciones_turnos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        -- turno_id ahora es NULLable, permitiendo asignaciones manuales
        turno_id INT NULL,
        fecha DATE NOT NULL,
        -- Nuevos campos para registrar el horario si no se usa un turno predefinido
        hora_inicio_manual TIME DEFAULT NULL,
        hora_fin_manual TIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE,
        -- La clave foránea sigue existiendo, pero ahora se permite NULL
        FOREIGN KEY (turno_id) REFERENCES turnos (id) ON DELETE CASCADE
    );

-- ==============================
-- 6. Tabla marcajes (control horario)
-- ==============================
CREATE TABLE
    marcajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        empresa_id INT NOT NULL,
        tipo ENUM ('entrada', 'salida', 'pausa_inicio', 'pausa_fin') NOT NULL,
        fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        metodo ENUM ('web', 'movil', 'qr', 'biometrico') DEFAULT 'web',
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 7. Tabla ausencias/vacaciones
-- ==============================
CREATE TABLE
    ausencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        empresa_id INT NOT NULL,
        tipo ENUM ('vacaciones', 'enfermedad', 'otro') NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        estado ENUM ('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 8. Tabla Parametros de empresa
-- ==============================
CREATE TABLE
    parametros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id INT NOT NULL,
        jornada_max_diaria DECIMAL(4, 2) DEFAULT 8.00,
        jornada_max_semanal DECIMAL(5, 2) DEFAULT 48.00,
        horas_nocturnas_inicio TIME DEFAULT '21:00:00',
        horas_nocturnas_fin TIME DEFAULT '06:00:00',
        jornada_max_nocturna DECIMAL(4, 2) DEFAULT 7.00,
        jornada_max_insalubre DECIMAL(4, 2) DEFAULT 6.00,
        permite_horas_extras BOOLEAN DEFAULT TRUE,
        max_horas_extras_diarias DECIMAL(3, 1) DEFAULT 2.0,
        max_horas_extras_semanales DECIMAL(3, 1) DEFAULT 10.0,
        tiempo_descanso_minimo DECIMAL(3, 1) DEFAULT 12.0, -- en horas
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas (id)
    );

-- ==============================
-- 8. Datos iniciales
-- ==============================
-- Empresa
INSERT INTO
    empresas (nombre, pag_web, direccion, razon_social, telefono, cuit, email)
VALUES
    (
        'HCTech Solutions',
        'HCTechSolutions.com',
        'Sin Direccion',
        'HCTech Solutions',
        'Sin Telefono',
        '99-99999999-9',
        'hctech@'
    ),
    (
        'Logística del Plata',
        'PlataSA.com',
        'Ruta 2 Km 45, La Plata',
        'Logística del Plata SA',
        '0221-478-1234',
        '30-80123456-7',
        'info@logisticaplata.com'
    ),
    (
        'Hotel Buenavista',
        'HotelBuenavista.com',
        'San Martín 567, Mar del Plata',
        'Hotel Buenavista',
        '0223-490-4567',
        '30-90234567-6',
        'reservas@hotelbuenavista.com'
    ),
    (
        'Agroexportaciones del Sur',
        'AgroexportacionesSur.com',
        'Ruta 33 Km 10, Rosario',
        'Agroexportaciones del Sur S.A',
        '0341-400-7890',
        '30-65432109-5',
        'ventas@agrosur.com'
    ),
    (
        'Desarrollos Web Argentina',
        'DesarrollosAR.com',
        'Calle Belgrano 890, Córdoba',
        'Desarrollos Web AR',
        '0351-455-6677',
        '30-12345678-9',
        'soporte@desarrolloswebar.com'
    );

-- Usuario administrador
INSERT INTO
    usuarios (empresa_id, nombre, email, password, rol)
VALUES
    (
        1,
        'Super-Admin',
        'super@',
        '$2b$10$QNJhcJ3BW4O2prVo5fqai.4pzQOh4gZGGHAWytTEGGJUM9bYFy0vO',
        'superadmin'
    ),
    (
        1,
        'Admin',
        'admin@',
        '$2b$10$AzxhOGE3xDkKwTckSh5kh.gdPq8uTZ5zqj6qbrnvQIarABDeohhui',
        'admin'
    ),
    (
        1,
        'Empleado',
        'empleado@',
        '$2b$10$jE8ljBHh/u9/Y16PdxRFjuuATX3wS15o45PyhY1.exLGQouSoGNJW',
        'empleado'
    ),
    (
        2,
        'Administrador 2',
        'admin2@',
        '$2b$10$PANUXEqDhFJxYHGIC6b5beLZTNumTI.GVTL8LpX8sEY5DWVnzeEcG',
        'admin'
    ),
    (
        2,
        'Empleado 2',
        'empleado2@',
        '$2b$10$bsFtSaV/4eI0TdpPB6vx/unyhIyVD0ig5LhTQ3e4gkohCgiQAJaCq',
        'empleado'
    );

-- Turnos predefinidos
INSERT INTO
    turnos (empresa_id, nombre, hora_inicio, hora_fin)
VALUES
    (1, 'Mañana', '06:00:00', '14:00:00'),
    (1, 'Tarde', '14:00:00', '22:00:00'),
    (1, 'Noche', '22:00:00', '06:00:00');

-- ==============================
-- Empleados
-- ==============================
INSINSERT INTO
    empleados (
        empresa_id,
        nombre,
        apellido,
        telefono, 
        direccion,
        fecha_nac,
        turno,    
        dni,
        puesto,
        fecha_ingreso,
        activo    
    )
VALUES
    (
        1,
        'Juan',
        'Pérez',
        '3415550101',
        'Calle Falsa 123, Piso 1',
        '1995-05-15',
        'Mañana',
        '30111222',
        'Recepcionista',
        '2020-01-15',
        TRUE
    ),
    (
        1,
        'Ana',
        'Gómez',
        '3415550202',
        'Avenida Siempre Viva 742',
        '1998-08-22',
        'Tarde',
        '28999888',
        'Camarera',
        '2019-03-10',
        TRUE
    ),
    (
        1,
        'Carlos',
        'López',
        '3415550303',
        'Boulevard de los Sueños 50',
        '1992-03-01',
        'Noche',
        '31222333',
        'Cocinero',
        '2021-07-05',
        TRUE
    ),
    (
        1,
        'María',
        'Fernández',
        '3415550404',
        'Pasaje Secreto 88',
        '1985-11-20',
        'Mañana',
        '27555666',
        'Gobernanta',
        '2018-11-22',
        TRUE
    ),
    (
        1,
        'Roberto',
        'Sosa',
        '3415550505',
        'Ruta 9, Km 10',
        '1979-04-30',
        'Tarde',
        '29333444',
        'Mantenimiento',
        '2022-05-10',
        TRUE
    ),
    (
        1,
        'Julia',
        'Ramos',
        '3415550606',
        'Calle del Sol 25',
        '2000-12-12',
        'Noche',
        '33444555',
        'Barman',
        '2023-08-01',
        TRUE
    ),
    (
        1,
        'Martín',
        'Vega',
        '3415550707',
        'Avenida Principal 404',
        '1990-01-01',
        'Noche',
        '34555666',
        'Portero',
        '2024-01-20',
        TRUE
    ),
    (
        1,
        'Sofia',
        'Díaz',
        '3415550808',
        'Plaza Central 15',
        '1997-06-06',
        'Mañana',
        '35666777',
        'Recepcionista',
        '2023-04-10',
        TRUE
    ),
    (
        1,
        'Andrés',
        'Castro',
        '3415550909',
        'Calle Última 99',
        '1994-02-28',
        'Tarde',
        '36777888',
        'Camarero',
        '2022-11-11',
        TRUE
    ),
    (
        1,
        'Paula',
        'Luna',
        '3415551010',
        'Paseo de la Costa 300',
        '1999-07-17',
        'Mañana',
        '37888999',
        'Limpieza',
        '2024-06-01',
        TRUE
    );

-- ID 10
-- ==============================
-- Asignación de turnos
-- ==============================
INSERT INTO
    asignaciones_turnos (
        empleado_id,
        turno_id,
        fecha,
        hora_inicio_manual,
        hora_fin_manual
    )
VALUES
    (1, 1, '2025-10-21', NULL, NULL), -- 1. Predefinido: Empleado 1, Turno 1 (Mañana)
    (2, NULL, '2025-10-21', '07:30:00', '15:30:00'), -- 2. Manual: Empleado 2, Horario ad-hoc
    (3, 2, '2025-10-21', NULL, NULL), -- 3. Predefinido: Empleado 3, Turno 2 (Tarde)
    (4, NULL, '2025-10-21', '09:00:00', '13:00:00'), -- 4. Manual: Empleado 4, Turno de media jornada
    (5, 3, '2025-10-21', NULL, NULL), -- 5. Predefinido: Empleado 5, Turno 3 (Noche)
    (6, NULL, '2025-10-22', '10:00:00', '19:00:00'), -- 6. Manual: Empleado 6, Horario extendido
    (7, 1, '2025-10-22', NULL, NULL), -- 7. Predefinido: Empleado 7, Turno 1, para el día siguiente
    (8, NULL, '2025-10-22', '22:00:00', '06:00:00'), -- 8. Manual: Empleado 8, Turno que cruza la medianoche (típico turno nocturno)
    (9, 2, '2025-10-22', NULL, NULL), -- 9. Predefinido: Empleado 9, Turno 2, para el día siguiente
    (10, NULL, '2025-10-23', '14:00:00', '17:00:00');

-- 10. Manual: Empleado 10, Turno de capacitación corto
-- ==============================
-- Marcajes (entradas/salidas)
-- ==============================
INSERT INTO
    marcajes (empleado_id, empresa_id, tipo, fecha_hora, metodo)
VALUES
    (1, 1, 'entrada', '2025-09-01 06:05:00', 'movil'),
    (1, 1, 'salida', '2025-09-01 14:10:00', 'movil'),
    (2, 1, 'entrada', '2025-09-01 14:02:00', 'web'),
    (2, 1, 'salida', '2025-09-01 22:00:00', 'web'),
    (3, 1, 'entrada', '2025-09-01 22:05:00', 'qr');

-- ==============================
-- Ausencias / Vacaciones
-- ==============================
INSERT INTO
    ausencias (
        empleado_id,
        empresa_id,
        tipo,
        fecha_inicio,
        fecha_fin,
        estado
    )
VALUES
    (
        4,
        1,
        'vacaciones',
        '2025-09-05',
        '2025-09-10',
        'aprobada'
    ),
    (
        2,
        1,
        'enfermedad',
        '2025-09-02',
        '2025-09-04',
        'pendiente'
    );

-- ==============================
-- Parametros de empresa
-- ==============================
INSERT INTO
    parametros (
        empresa_id,
        jornada_max_diaria,
        jornada_max_semanal,
        horas_nocturnas_inicio,
        horas_nocturnas_fin,
        permite_horas_extras,
        max_horas_extras_diarias
    )
VALUES
    (1, 8, 48, '21:00:00', '06:00:00', TRUE, 2);