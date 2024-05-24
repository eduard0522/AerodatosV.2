import { getConnection,releaseConnection } from "../db/index.js";


export async function validateUser(email) {
 
  if(!email){
   return {error:'Los datos requeridos vieven incompletos'}
  }
  let conn ;
  try {
    conn = await getConnection();
    const ifExistUser = await conn.query('SELECT *  FROM usuarios WHERE correo = $1 ',[email]);

    if(ifExistUser.rows.length > 0 && !ifExistUser.error){
      return ifExistUser.rows;
    }else{
        return  {error:'Este usuario no existe.'}
    }
  } catch (error) {
    console.log(error)
    return {error:'Ocurrio un error inesperado, intente de nuevo mas tarde.'};
  }finally{
    if(conn)  releaseConnection(conn)
  }
}