import {connectionDB} from '../db/index.js'


export const validateUserModel = async (userName,pass) => {
  try {
    const [result] = await connectionDB.query('SELECT * FROM usuarios WHERE (nombre_usuario = ?) AND (clave = ?)',[userName,pass]);
    if(!result){
      throw{
        status: 401,
        message: ' Usuario o clave incorrectos'
      };
    }
    return result 
  } catch (error) {
    console.log(error)
    return error
  }
}
