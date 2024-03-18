import mysql from 'mysql2/promise';
import { configBD } from './config.js'



  export async function connectionDatabase() {
      try {
        const connectionDB = await mysql.createConnection(configBD);
        console.log('Conexión exitosa');
        return connectionDB;
      } catch (error) {
        console.error('Error en la conexión:', error);
        throw error;
      }
    }


