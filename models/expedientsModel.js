import { getConnection,releaseConnection } from "../db/index.js";


// TRAE TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 

export async function getExpedientsService(){
  try {
    const conn =  await getConnection()
    const expedients = await conn.query('SELECT  * FROM expedientes');

    if(expedients && !expedients.error ){
      releaseConnection(conn)
      return expedients[0]   
     }

     return null
  } catch (error) {
      console.log(error)
      releaseConnection(conn)
      return null
  }
}





/*************************** CAJAS  **************************/

// CREAR CAJAS 

export async function newBoxService(caja) {
   if(!caja){
    console.log("No se ha recibido caja")
    return null
   }
   try {
    const conn =  await getConnection()
    // VALIDAR SI LA CAJA YA EXISTE
    const [ifExist] = await conn.query('SELECT * FROM cajas WHERE numero_caja = ?' ,[caja]);
    if(ifExist.length > 0){
      //SI YA EXISTE, RETORNA TRUE
      return true
    }
    // SI NO EXISTE LA CAJA ENVIA LA INFORMACION PARA INSEERTARLA
    const result = await conn.query('INSERT INTO cajas (numero_caja) VALUES (?)', [caja]);
    if(result && !result.error ){
      releaseConnection(conn)
      return result[0]   
     }

     return null
  } catch (error) {
      console.log(error)
      releaseConnection(conn)
      return null
  }
}


// ELIMINAR CAJAS

export async function deleteBoxService(caja) {
  if(!caja){
   console.log("No se ha recibido caja")
   return null
  }
  try {
   const conn =  await getConnection()
   const deleteBox = await conn.query('DELETE from cajas WHERE numero_caja = ?' ,[caja]);
   if(deleteBox){
    releaseConnection(conn)
     return true
   }
    return null
 } catch (error) {
     console.log(error)
     return null
 }
}