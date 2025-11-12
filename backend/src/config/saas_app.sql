-- Crear base de datos
CREATE DATABASE IF NOT EXISTS saas_app;

USE saas_app;

-- ==============================
-- 1. Tabla empresas
-- ==============================
CREATE TABLE
    IF NOT EXISTS empresas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        pag_web VARCHAR(150) DEFAULT NULL,
        direccion VARCHAR(255) DEFAULT NULL,
        razon_social VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(150) DEFAULT NULL,
        telefono VARCHAR(50) DEFAULT NULL,
        imagen MEDIUMTEXT DEFAULT NULL,
        cuit VARCHAR(20) UNIQUE
    );

-- ==============================
-- 2. Tabla usuarios (admins, empleados con acceso al sistema)
-- ==============================
CREATE TABLE
    usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        imagen MEDIUMTEXT DEFAULT NULL,
        password VARCHAR(255) NOT NULL, -- hashed
        rol ENUM ('superadmin', 'admin', 'empleado') DEFAULT 'empleado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ==============================
-- 3. Tabla empleados
-- ==============================
CREATE TABLE
    empleados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empresa_id INT NOT NULL,
        nombre VARCHAR(200) NOT NULL,
        telefono VARCHAR(20),
        rol ENUM ('superadmin', 'admin', 'empleado') DEFAULT 'empleado',
        email VARCHAR(100) UNIQUE NOT NULL,
        direccion VARCHAR(255) DEFAULT NULL,
        fecha_nac DATE,
        turno VARCHAR(50) NOT NULL, -- Ej: "Mañana", "Tarde", "Noche"
        dni VARCHAR(20) UNIQUE,
        estado ENUM ('Ausente', 'Inactivo', 'Activo', 'Vacaciones') DEFAULT 'Ausente',
        imagen MEDIUMTEXT DEFAULT NULL,
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
-- 6. Tabla marcajes (control horario)
-- ==============================
CREATE TABLE
    marcajes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        empresa_id INT NOT NULL, 
        dia DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        entrada TIME NULL,
        salida TIME NULL,
        metodo ENUM ('web', 'movil', 'qr', 'biometrico') DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE
    );

-- ==============================
-- Tabla tramites 
-- ==============================

CREATE TABLE
    tramites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        empresa_id INT NOT NULL, 
        estado ENUM ('Pendiente','En progreso','Aprobado','Rechazado') DEFAULT 'Pendiente',
        asunto VARCHAR(50) NOT NULL,
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_cerrado TIMESTAMP null,
        descripcion VARCHAR(250) NOT NULL,
        devolucion VARCHAR(250) NOT NULL,
        encargado INT DEFAULT NULL,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE
    );

-- ==============================
-- Tabla calendario
-- ==============================
CREATE TABLE
    calendario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        estado VARCHAR(20) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE
    );

-- ==============================
-- 7. Tabla ausencias/vacaciones
-- ==============================
CREATE TABLE
    ausencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empleado_id INT NOT NULL,
        empresa_id INT NOT NULL,
        tipo VARCHAR(20) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        estado ENUM ('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empleado_id) REFERENCES empleados (id) ON DELETE CASCADE
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
        FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
    );

-- ==============================
-- 8. Datos iniciales
-- ==============================

-- Usuario administrador
INSERT INTO
    usuarios ( nombre, email, password, rol)
VALUES
    (
        'Super-Admin',
        'super@super',
        '$2b$10$QNJhcJ3BW4O2prVo5fqai.4pzQOh4gZGGHAWytTEGGJUM9bYFy0vO',
        'superadmin'
    ),
    (
        'Admin',
        'admin@admin',
        '$2b$10$AzxhOGE3xDkKwTckSh5kh.gdPq8uTZ5zqj6qbrnvQIarABDeohhui',
        'admin'
    ),
    (
        'Empleado',
        'empleado@empleado',
        '$2b$10$jE8ljBHh/u9/Y16PdxRFjuuATX3wS15o45PyhY1.exLGQouSoGNJW',
        'empleado'
    ),
    (
        'Administrador 2',
        'admin2@admin2',
        '$2b$10$PANUXEqDhFJxYHGIC6b5beLZTNumTI.GVTL8LpX8sEY5DWVnzeEcG',
        'admin'
    ),
    (
        'Empleado 2',
        'empleado2@empleado2',
        '$2b$10$bsFtSaV/4eI0TdpPB6vx/unyhIyVD0ig5LhTQ3e4gkohCgiQAJaCq',
        'empleado'
    );


-- Empresa
INSERT INTO
    empresas (nombre, user_id, pag_web, direccion, razon_social, telefono, cuit, email)
VALUES
(
        'Logística del Plata',
        1,
        'PlataSA.com',
        'Ruta 2 Km 45, La Plata',
        'Logística del Plata SA',
        '0221-478-1234',
        '30-80123456-7',
        'info@logisticaplata.com'
    ),
    (
        'HCTech Solutions',
        1,
        'HCTechSolutions.com',
        'Sin Direccion',
        'HCTech Solutions',
        'Sin Telefono',
        '99-99999999-9',
        'hctech@hctech'
    );
    -- (
    --     'Hotel Buenavista',
    --     3,
    --     'HotelBuenavista.com',
    --     'San Martín 567, Mar del Plata',
    --     'Hotel Buenavista',
    --     '0223-490-4567',
    --     '30-90234567-6',
    --     'reservas@hotelbuenavista.com'
    -- ),
    -- (
    --     'Agroexportaciones del Sur',
    --     4,
    --     'AgroexportacionesSur.com',
    --     'Ruta 33 Km 10, Rosario',
    --     'Agroexportaciones del Sur S.A',
    --     '0341-400-7890',
    --     '30-65432109-5',
    --     'ventas@agrosur.com'
    -- ),
    -- (
    --     'Desarrollos Web Argentina',
    --     5,
    --     'DesarrollosAR.com',
    --     'Calle Belgrano 890, Córdoba',
    --     'Desarrollos Web AR',
    --     '0351-455-6677',
    --     '30-12345678-9',
    --     'soporte@desarrolloswebar.com'
    -- );


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
INSERT INTO
    empleados (
        empresa_id,
        nombre,
        email,
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
        'Juan Pérez',
        'Juan@Pérez',
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
        'Ana Gómez',
        'Ana@Gómez',
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
        'Carlos López',
        'Carlos@López',
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
        'María Fernández',
        'María@Fernández',
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
        'Roberto Sosa',
        'Roberto@Sosa',
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
        'Julia Ramos',
        'Julia@Ramos',
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
        'Martín Vega',
        'Martín@Vega',
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
        'Sofia Díaz',
        'Sofia@Díaz',
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
        'Andrés Castro',
        'Andrés@Castro',
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
        'Paula Luna',
        'Paula@Luna',
        '3415551010',
        'Paseo de la Costa 300',
        '1999-07-17',
        'Mañana',
        '37888999',
        'Limpieza',
        '2024-06-01',
        TRUE
    );


-- 10. Manual: Empleado 10, Turno de capacitación corto
-- ==============================
-- Marcajes (entradas/salidas)
-- ==============================
INSERT INTO marcajes(empleado_id, empresa_id, dia, hora_inicio, hora_fin)
VALUES
    (1, 1,"2025-11-01" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-03" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-03" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-03" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-04" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-04" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-05" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-05" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-06" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-06" ,'22:00:00', '06:00:00'),
    (1, 1,"2025-11-07" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-07" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-11-08" ,'06:00:00', '14:00:00'),
    (1, 1,"2025-09-08" ,'14:00:00', '22:00:00'),
    (2, 1,"2025-09-01" ,'14:00:00', '22:00:00'),
    (2, 1,"2025-09-02" ,'22:00:00', '06:00:00'),
    (3, 1,"2025-09-02" ,'22:00:00', '06:00:00');

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
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (4,1,'vacaciones','2025-09-05','2025-09-10','aprobada'),
    (2,1,'enfermedad','2025-09-02','2025-09-04','pendiente');

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