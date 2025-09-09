-- Crear base de datos
CREATE DATABASE IF NOT EXISTS saas_app;
USE saas_app;

-- ==============================
-- 1. Tabla empresas
-- ==============================
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cuit VARCHAR(20) UNIQUE,
    direccion VARCHAR(150),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================
-- 2. Tabla usuarios (admins, empleados con acceso al sistema)
-- ==============================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- hashed
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- ==============================
-- 3. Tabla empleados
-- ==============================
CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE,
    puesto VARCHAR(100),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- ==============================
-- 4. Tabla turnos predefinidos
-- ==============================
CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,         -- Ej: "Mañana", "Tarde", "Noche"
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- ==============================
-- 5. Tabla asignación de turnos (empleados)
-- ==============================
CREATE TABLE asignaciones_turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    turno_id INT NOT NULL,
    fecha DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (turno_id) REFERENCES turnos(id) ON DELETE CASCADE
);

-- ==============================
-- 6. Tabla marcajes (control horario)
-- ==============================
CREATE TABLE marcajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    empresa_id INT NOT NULL,
    tipo ENUM('entrada', 'salida', 'pausa_inicio', 'pausa_fin') NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo ENUM('web', 'movil', 'qr', 'biometrico') DEFAULT 'web',
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- ==============================
-- 7. Tabla ausencias/vacaciones
-- ==============================
CREATE TABLE ausencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    empresa_id INT NOT NULL,
    tipo ENUM('vacaciones', 'enfermedad', 'otro') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('pendiente', 'aprobada', 'rechazada') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

-- ==============================
-- 8. Datos iniciales
-- ==============================

-- Empresa
INSERT INTO empresas (nombre, cuit, direccion, email)
VALUES ('Hotel República', '30-12345678-9', 'Av. Corrientes 1234, CABA', 'info@hotel.com');

-- Usuario administrador
INSERT INTO usuarios (empresa_id, nombre, email, password, rol)
VALUES (1, 'Administrador Hotel', 'admin@hotel.com', 'hash_password', 'admin');

-- Turnos predefinidos
INSERT INTO turnos (empresa_id, nombre, hora_inicio, hora_fin)
VALUES 
(1, 'Mañana', '06:00:00', '14:00:00'),
(1, 'Tarde', '14:00:00', '22:00:00'),
(1, 'Noche', '22:00:00', '06:00:00');

-- ==============================
-- Empleados
-- ==============================
INSERT INTO empleados (empresa_id, nombre, apellido, dni, puesto, fecha_ingreso)
VALUES
(1, 'Juan', 'Pérez', '30111222', 'Recepcionista', '2020-01-15'),
(1, 'Ana', 'Gómez', '28999888', 'Camarera', '2019-03-10'),
(1, 'Carlos', 'López', '31222333', 'Cocinero', '2021-07-05'),
(1, 'María', 'Fernández', '27555666', 'Gobernanta', '2018-11-22');

-- ==============================
-- Asignación de turnos
-- ==============================
INSERT INTO asignaciones_turnos (empleado_id, turno_id, fecha)
VALUES
(1, 1, '2025-09-01'), -- Juan → Mañana
(2, 2, '2025-09-01'), -- Ana → Tarde
(3, 3, '2025-09-01'), -- Carlos → Noche
(4, 1, '2025-09-01'); -- María → Mañana

-- ==============================
-- Marcajes (entradas/salidas)
-- ==============================
INSERT INTO marcajes (empleado_id, empresa_id, tipo, fecha_hora, metodo)
VALUES
(1, 1, 'entrada', '2025-09-01 06:05:00', 'movil'),
(1, 1, 'salida', '2025-09-01 14:10:00', 'movil'),
(2, 1, 'entrada', '2025-09-01 14:02:00', 'web'),
(2, 1, 'salida', '2025-09-01 22:00:00', 'web'),
(3, 1, 'entrada', '2025-09-01 22:05:00', 'qr');

-- ==============================
-- Ausencias / Vacaciones
-- ==============================
INSERT INTO ausencias (empleado_id, empresa_id, tipo, fecha_inicio, fecha_fin, estado)
VALUES
(4, 1, 'vacaciones', '2025-09-05', '2025-09-10', 'aprobada'),
(2, 1, 'enfermedad', '2025-09-02', '2025-09-04', 'pendiente');
