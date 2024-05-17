import { getConnection,releaseConnection } from "../db/index.js";


export async function validateUser(email) {
 
  if(!email){
    throw new Error('Los datos requeridos vieven incompletos');
  }
  try {
    const conn = await getConnection();

    const [ifExistUser] = await conn.query('SELECT *  FROM usuarios WHERE correo =? ',[email]);

    if(ifExistUser.length != 0 && !ifExistUser.error){
      releaseConnection(conn)
      return ifExistUser;
    }else{
        releaseConnection(conn)
        return null
    }
  } catch (error) {
    console.log(error)
    return null;
  }
}