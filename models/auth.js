import { getConnection,releaseConnection } from "../db/index.js";


export async function validateUser(userName,password) {
 
  if(!userName && !password){
    throw new Error('Los datos requeridos vieven incompletos');
  }
  try {
    const conn = await getConnection();
    console.log(userName, password)

    const ifExistUser = await conn.query('SELECT nombre_usuario, rol, id_usuario FROM usuarios WHERE nombre_usuario =? and clave =? ',[userName,password]);

    if(ifExistUser[0] != 0 && !ifExistUser.error){
      releaseConnection(conn)
      return ifExistUser[0];
    }else{
        releaseConnection(conn)
       throw new Error('Error inesperado desde la base de datos');
    }
  } catch (error) {
    console.log(error)
    return null;
  }
}