import mysql from 'mysql2/promise';
import { configBD } from './config.js'




   export const connectionDB = await mysql.createConnection(configBD);
    if(!connectionDB){
      console.log('Error en la conexión')
    }else{
      console.log('Conexión exitosa')
    }



