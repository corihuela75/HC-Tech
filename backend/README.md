# 🕒 Sistema de Control de Horarios de Empleados

Este proyecto implementa un **Sistema de Control de Horarios de Empleados** desarrollado con **Node.js**, **Express** y **MySQL**.  
Permite gestionar empleados, turnos, marcajes y ausencias de manera centralizada, facilitando el control de asistencia y la administración del personal.

---

## 🚀 Tecnologías utilizadas

- **Node.js** – Entorno de ejecución para el backend  
- **Express.js** – Framework para el desarrollo del servidor  
- **MySQL** – Base de datos relacional  
- **Pug** – Motor de plantillas para renderizar vistas  
- **JWT (JSON Web Token)** – Autenticación segura  
- **Redocly / OpenAPI** – Documentación de API  

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio:
   ```
    git clone https://github.com/corihuela75/HC-Tech.git
   ```

### 2. Instalar dependencias:

  ```
  npm install
  ```
 
### 3. Ejecutar el script de base de datos (saas_app.sql)

Abrir el cliente MySQL (MySQL Workbench, terminal o cualquier gestor SQL).
Ejecutar el contenido del archivo:

SOURCE /backend/src/config/db.sql;

Esto creará las tablas y agregará los usuarios de prueba.

### 4. Configurar las variables de entorno (.env):

```
DB_HOST=localhost
DB_USER=root
DB_PASS=admin123    
DB_NAME=saas_app
DB_PORT=3306
PORT=3000
JWT_SECRET=HCTech
```

### 5. Moverse a la carpeta backend

```
cd backend
```

### 6. Ejecutar el servidor:

```
npm run dev
```

El servidor quedará disponible en:  👉 http://localhost:3000

### 7. Usuarios de acceso demo

| Usuario | Contraseña | Rol
| :--- | :--- | :--- |
| super@ | 1234 | SuperAdmin |
| admin@ | 1234 | Admin |
| empleado@ | 1234 | Empleado |

Nota: Las contraseñas se guardan hasheadas en la base de datos, listas para usar con el login.


## 📂 Estructura del proyecto

```
PP4/
├── .github/                     # Configuración de acciones y flujos de GitHub
├── backend/                     # Carpeta principal del backend
│   ├── doc/                     # Documentación del proyecto (OpenAPI, Redocly, etc.)
│   ├── src/                     # Código fuente del servidor
│   │   ├── config/              # Configuración general (DB, variables de entorno, etc.)
│   │   ├── controllers/         # Controladores que manejan la lógica de las rutas
│   │   ├── middlewares/         # Middlewares (autenticación, validaciones, logs, etc.)
│   │   ├── models/              # Modelos de datos y consultas a la base de datos
│   │   ├── routes/              # Definición de endpoints y rutas
│   │   └── views/               # Vistas renderizadas (motor Pug)
│   ├── app.js                   # Punto de entrada del servidor Express
│   ├── .env                     # Variables de entorno (no subir al repo)
│   ├── .gitignore               # Archivos/carpetas ignoradas por Git
│   ├── package.json             # Dependencias y scripts del proyecto
│   ├── package-lock.json        # Bloqueo de versiones
│   ├── .prettierrc.json         # Configuración de formato del código
│   └── README.md                # Documentación específica del backend
├── node_modules/                # Dependencias instaladas
├── public/                      # Archivos estáticos (CSS, imágenes, JS, etc.)
└── .gitignore                   # Ignora archivos en el repositorio raíz

```

## 📘 Documentación de la API

La documentación de los endpoints está disponible en formato OpenAPI (YAML) dentro de la carpeta backend/doc.

La documentación completa de la API está disponible localmente en formato HTML: 👉 [Ver documentación de la API](http://localhost:3000/doc/index.html)

También podés acceder al archivo directamente en el repositorio:

```
/backend/doc/index.html
```

Luego abrí openapi.html en tu navegador para visualizar la documentación interactiva.

## 🧩 Scripts útiles
Comando	Descripción
```
npm start //	Inicia el servidor en modo producción
npm run dev //	Inicia el servidor con nodemon (desarrollo)
npm test //	Ejecuta los tests (si están configurados)
```


## 👤 Autores

**Heber Duarte**
* 📧 heberduarteryr@gmail.com
* 🔗 GitHub - Heber-739


**Cristian Orihuela**
* 📧 ori@live.com.ar
* 🔗 GitHub - corihuela75