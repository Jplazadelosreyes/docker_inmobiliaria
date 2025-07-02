[![Testear Aplicación Docker Compose](https://github.com/Jplazadelosreyes/docker_inmobiliaria/actions/workflows/test.yml/badge.svg)](https://github.com/Jplazadelosreyes/docker_inmobiliaria/actions/workflows/test.yml)
# InmoApp 🏠

**Aplicación Web Inmobiliaria Multi-Contenedor**

Una aplicación web completa para listar propiedades inmobiliarias, construida con arquitectura de microservicios utilizando Docker. El proyecto incluye frontend estático con Nginx, API backend con Node.js/Express, base de datos PostgreSQL y orquestación con Docker Compose.

## 🚀 Características

- **Frontend estático** servido con Nginx
- **API REST** desarrollada en Node.js con Express
- **Base de datos PostgreSQL** para persistencia de datos
- **Orquestación completa** con Docker Compose
- **Comunicación entre contenedores** en red personalizada
- **CI/CD básico** con GitHub Actions
- **Interfaz responsive** con diseño moderno

## 📂 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── test.yml              # Workflow de GitHub Actions
├── backend/
│   ├── Dockerfile               # Imagen Docker para Node.js
│   ├── app.js                   # Servidor Express y API
│   └── package.json             # Dependencias del backend
├── nginx/
│   ├── Dockerfile               # Imagen Docker para Nginx
│   └── index.html               # Frontend de la aplicación
└── docker-compose.yml            # Orquestación de servicios
```

## ⚙️ Arquitectura de Servicios

### 🌐 Web (Nginx)
- **Puerto**: 8080 → 80
- **Función**: Servir el frontend estático
- **Dependencias**: Backend API

### 🖥️ Backend (Node.js + Express)
- **Puerto**: 3000 → 3000
- **Función**: API REST para gestión de propiedades
- **Dependencias**: Base de datos PostgreSQL
- **Endpoints**:
    - `GET /` - Estado del servidor
    - `GET /api/propiedades` - Lista de propiedades

### 🗄️ Base de Datos (PostgreSQL)
- **Puerto**: 5432 → 5432
- **Versión**: PostgreSQL 12
- **Persistencia**: Volumen nombrado `pgdata`
- **Esquema**: Tabla `propiedades` con campos `id` y `direccion`

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose instalados
- Git (para clonar el repositorio)

### Pasos para ejecutar

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd inmoapp
   ```

2. **Construir y levantar los servicios**
   ```bash
   docker-compose up --build -d
   ```
    - `--build`: Reconstruye las imágenes con los últimos cambios
    - `-d`: Ejecuta en segundo plano

3. **Insertar datos de prueba**
   ```bash
   # Acceder al contenedor de PostgreSQL
   docker exec -it docker_inmobiliaria-db-1 psql -U postgres -d docker_inmobiliaria
   
   # Ejecutar en psql:
   INSERT INTO propiedades (direccion) VALUES
   ('Calle 123, Bogotá'),
   ('Calle del Sol 5'),
   ('Avenida de la Luna 10'),
   ('Plaza Mayor 3'),
   ('Paseo del Río 22'),
   ('Callejón de la Flor 7'),
   ('Ronda de Noche 15'),
   ('Camino Viejo 1'),
   ('Calle Nueva 8'),
   ('Avenida del Mar 4'),
   ('Travesía del Parque 12'),
   ('Nueva calle 1717');
   
   # Salir
   \q
   ```

4. **Acceder a la aplicación**
    - Abrir navegador en: http://localhost:8080
    - La página mostrará el listado de propiedades cargado dinámicamente

## 🔧 Comandos Útiles

### Gestión de contenedores
```bash
# Ver estado de los servicios
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs web
docker-compose logs db

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (¡cuidado, borra datos!)
docker-compose down -v

# Reconstruir un servicio específico
docker-compose up --build backend
```

### Acceso directo a servicios
```bash
# Acceder al contenedor del backend
docker exec -it <nombre-contenedor-backend> /bin/bash

# Acceder a PostgreSQL
docker exec -it <nombre-contenedor-db> psql -U postgres -d docker_inmobiliaria

# Ver logs en tiempo real
docker-compose logs -f backend
```

## 🧪 Testing y CI/CD

El proyecto incluye un workflow de GitHub Actions que automatiza:

- ✅ Construcción de imágenes Docker
- ✅ Levantamiento de servicios
- ✅ Inserción de datos de prueba
- ✅ Testing de endpoints con `curl`
- ✅ Verificación de respuestas JSON
- ✅ Limpieza automática

El workflow se ejecuta en cada `push` o `pull_request` a la rama `main`.

## 🔍 Solución de Problemas

### Error de conexión a la base de datos
```bash
# Verificar que la DB esté corriendo
docker-compose ps

# Ver logs de la base de datos
docker-compose logs db

# Verificar conectividad desde el backend
docker exec -it <backend-container> ping db
```

### Frontend no carga propiedades
1. Verificar que el backend esté respondiendo:
   ```bash
   curl http://localhost:3000/api/propiedades
   ```

2. Revisar consola del navegador (F12) para errores JavaScript

3. Verificar que la tabla tenga datos:
   ```sql
   SELECT * FROM propiedades;
   ```

### Problemas de caché del navegador
- Usar modo incógnito/privado
- Limpiar caché y cookies
- Forzar recarga con Ctrl+F5

## 🔗 Configuración de Base de Datos Externa

Para usar una base de datos PostgreSQL externa:

1. **Eliminar el servicio `db`** del `docker-compose.yml`

2. **Actualizar variables de entorno** en el servicio backend:
   ```yaml
   backend:
     # ...
     environment:
       POSTGRES_HOST: <IP_O_HOST_EXTERNO>
       POSTGRES_PORT: 5432
       POSTGRES_USER: <USUARIO_EXTERNO>
       POSTGRES_PASSWORD: <CONTRASEÑA_EXTERNA>
       POSTGRES_DB: <NOMBRE_DB_EXTERNA>
   ```

3. **Asegurar conectividad** de red al servidor externo

## 📋 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `POSTGRES_USER` | Usuario de PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nombre de la base de datos | `docker_inmobiliaria` |

## 🤝 Contribuciones

1. Fork del repositorio
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**¡Esperamos que disfrutes desarrollando con InmoApp!** 🚀
