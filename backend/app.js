const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Importa el paquete cors

const app = express();
const port = 3000; // El puerto en el que escuchará el backend

// Configuración de la conexión a PostgreSQL
// Usamos las variables de entorno que Docker Compose inyectará
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db', // 'db' es el nombre del servicio de la base de datos en docker-compose.yml
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432, // Puerto por defecto de PostgreSQL
});

// Middleware para permitir CORS (Cross-Origin Resource Sharing)
// Esto es necesario para que tu frontend (Nginx) pueda hacer peticiones a este backend
app.use(cors());
app.use(express.json()); // Para parsear JSON en las peticiones (si fuera necesario)

// Ruta de prueba para verificar que el backend funciona
app.get('/', (req, res) => {
    res.send('Backend de InmoApp funcionando!');
});

// Endpoint para obtener todas las propiedades
app.get('/api/propiedades', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, direccion FROM propiedades ORDER BY id');
        res.json(result.rows); // Envía las filas de la tabla como JSON
    } catch (err) {
        console.error('Error al obtener propiedades:', err);
        res.status(500).send('Error interno del servidor');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Backend escuchando en http://localhost:${port}`);
});

// Asegurarse de que la tabla 'propiedades' exista al iniciar el backend.
// IMPORTANTE: Ya no inserta datos de ejemplo automáticamente.
async function ensureTableExists() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS propiedades (
                                                       id SERIAL PRIMARY KEY,
                                                       direccion TEXT NOT NULL
            );
        `);
        console.log('Tabla "propiedades" verificada/creada.');
        // La sección para insertar datos de ejemplo si la tabla estaba vacía ha sido eliminada.
        // Ahora, la tabla solo se creará si no existe, pero no se poblará automáticamente.
    } catch (err) {
        console.error('Error al asegurar que la tabla exista:', err);
    }
}

// Llamar a la función para asegurar que la tabla exista al iniciar el backend
ensureTableExists();
