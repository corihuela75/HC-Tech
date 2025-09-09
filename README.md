Este proyecto implementa un **CRUD de empleados** usando **Node.js, Express y MySQL**.

---

## ⚙️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/backend.git
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno en `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=empresa_db
DB_PORT=3306
```

4. Levantar servidor:

```bash
npm run dev
```

Servidor corriendo en: `http://localhost:3000`

---

## 📂 Estructura del proyecto

```
/backend
├── src
│   ├── controllers
│   ├── routes
│   ├── models
│   └── db.js
├── .env
├── package.json
└── README.md
```

---

## 📘 API CRUD – Empleados

Base URL: `http://localhost:3000/api/empleados`

### 1️⃣ Crear empleado

`POST /api/empleados`

**Request body:**

```json
{
  "empresa_id": 2,
  "nombre": "Ana",
  "apellido": "Gómez",
  "dni": "12345678",
  "puesto": "Recepcionista",
  "fecha_ingreso": "2025-09-01"
}
```

**Response (201 Created):**

```json
{
  "id": 15,
  "empresa_id": 2,
  "nombre": "Ana",
  "apellido": "Gómez",
  "dni": "12345678",
  "puesto": "Recepcionista",
  "fecha_ingreso": "2025-09-01"
}
```

---

### 2️⃣ Listar todos los empleados

`GET /api/empleados`

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "empresa_id": 2,
    "nombre": "Carlos",
    "apellido": "López",
    "dni": "11111111",
    "puesto": "Gerente",
    "fecha_ingreso": "2022-05-01",
    "activo": true,
    "created_at": "2022-05-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "empresa_id": 2,
    "nombre": "Ana",
    "apellido": "Gómez",
    "dni": "12345678",
    "puesto": "Recepcionista",
    "fecha_ingreso": "2025-09-01",
    "activo": true,
    "created_at": "2025-09-01T12:00:00.000Z"
  }
]
```

---

### 3️⃣ Obtener un empleado por ID

`GET /api/empleados/:id`

**Response (200 OK):**

```json
{
  "id": 2,
  "empresa_id": 2,
  "nombre": "Ana",
  "apellido": "Gómez",
  "dni": "12345678",
  "puesto": "Recepcionista",
  "fecha_ingreso": "2025-09-01",
  "activo": true,
  "created_at": "2025-09-01T12:00:00.000Z"
}
```

**Errores posibles:**

- `404 Not Found` → empleado no encontrado

---

### 4️⃣ Actualizar empleado

`PUT /api/empleados/:id`

**Request body (campos a actualizar):**

```json
{
  "nombre": "Ana María",
  "puesto": "Jefa de Recepción",
  "activo": true}
```

**Response (200 OK):**

```json
{
  "id": 2,
  "empresa_id": 2,
  "nombre": "Ana María",
  "apellido": "Gómez",
  "dni": "12345678",
  "puesto": "Jefa de Recepción",
  "fecha_ingreso": "2025-09-01",
  "activo": true,
  "created_at": "2025-09-01T12:00:00.000Z"
}
```

---

### 5️⃣ Eliminar empleado

`DELETE /api/empleados/:id`

**Response (200 OK):**

```json
{
  "message": "Empleado eliminado correctamente"
}
```

**Errores posibles:**

- `404 Not Found` → empleado no encontrado

---

## 🚨 Errores comunes

- `400 Bad Request` → faltan datos obligatorios o JSON mal formado
- `409 Conflict` → el `dni` ya existe
- `500 Internal Server Error` → error en la base de datos o servidor