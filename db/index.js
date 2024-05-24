import {configDB} from './config.js'
import pkg from 'pg';
const { Pool } = pkg;

let pool = null;


// Inicializa el pool de conexiones
async function initializePool() {
  if (!pool) {
    pool = new Pool(configDB);
    console.log('Conjunto de conexiones inicializado');
  }
}

// Obtiene una conexión del pool
export async function getConnection() {
  await initializePool();
  try {
    const conn = await pool.connect();
    console.log('Se obtuvo una conexión del conjunto');
    return conn;
  } catch (error) {
    console.error('Error al obtener una conexión del conjunto:', error);
    return null;
  }
}

// Libera la conexión y la devuelve al pool
export async function releaseConnection(conn) {
  if (conn) {
    try {
      conn.release();
      console.log('Se liberó la conexión y se devolvió al conjunto');
    } catch (error) {
      console.error('Error al liberar la conexión:', error);
    }
  }
}

// Cierra el pool de conexiones
export async function closePool() {
  if (pool) {
    try {
      await pool.end();
      console.log('Conjunto de conexiones cerrado');
    } catch (error) {
      console.error('Error al cerrar el conjunto de conexiones:', error);
    }
  }
}


