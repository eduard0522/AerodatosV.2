import {connectionDB} from '../db/index.js'


export const validateUserModel = async (userName,pass) => {
  try {
    console.log('model')
    const [result] = await connectionDB.query('SELECT * FROM usuarios WHERE (nombre_usuario = ?) AND (clave = ?)',[userName,pass]);
    if(result.length === 0){
      throw{
        status: 401,
        message: ' Usuario o clave incorrectos'
      };
    }
    console.log(result , 'resultado validacion usuario')
    return result 
  } catch (error) {
    return error
  }
}



export const validateTokenModel = async(id)=>{
  try {

    const [result] = await connectionDB.query('SELECT * FROM usuarios WHERE (id_usuario = ?) ',[id]);
 
    if(result.length === 0){
      throw{
        status: 401,
        message: ' No estas Autorizado'
      };
    }
    return true 
  } catch (error) {
    throw {status: error?.status || 500, message:error?.message || error}
  }
 
}