esta son las tablas de mi base de datos relevantes:

CREATE DATABASE IF NOT EXISTS saas_app;

USE saas_app;

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

necesito la query indicando los parametros que necesite para que sea mas facil, que me devuelva una lista del 1 al ultimo dia del mes indicado por 'dia', de esta interface:
'','','Enfermedad Capacitación'
export interface MonthStaticalData {
  empleado_id:number;
  dia:Date;
  Data: {
  dia_libre:boolean;
  asistido:number;
  vacaciones:boolean;
  ausencia:number;
  licencia:boolean;
  enfermedad:boolean;
  capacitación:boolean;
  }
}
o sea que me devuelva MonthStaticalData[]
donde:
1- empleado_id : ID del empleado de la tabla 'empleados'
2- dia: el dia correspondiente de la informacion brindada
3- Data:
    - dia_libre, vacaciones,licencia,enfermedad,capacitación : se mapean con los valores posibles del campo 'tipo' de la tabla 'ausencias' ('Vacaciones','Día libre','Enfermedad','Licencia','Capacitación') si el dia esta incluido entre 'fecha_inicio' y 'fecha_fin' de la tabla 'ausencias'
    - asistido: el porcentaje del 0 al 100% del dia. Se saca en base a la tabla 'marcajes', donde se establece la hora de ingreso y egreso del empleado 'hora_inicio' y 'hora_fin', en comparacion con los campos 'entrada' y 'salida'. cuantas horas trabajo en comparacion a las establecidas
    - ausencia: el faltante del porcentaje de 'asistido' para llegar a 100
en mysql para usarse con esta funcion:
 await pool.query(query)