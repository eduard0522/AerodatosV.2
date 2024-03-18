import { connectionDatabase } from "../db/index.js";

export async function getRequestModel(){
  try {
    const connectionDB = await connectionDatabase()
    const [request] = await connectionDB.query('SELECT * FROM solicitudes  ORDER BY fecha_solicitud desc; ')
    if(!request){
      throw{
        status:500,
        message:'Internal Server Error'
      }
    }

    return request
  } catch (error) {
    return error
  }
}

export async function updateRequestModel(data,id){
  try {
    const connectionDB = await connectionDatabase()
    const{fecha_cierre,estado} = data
    const [update] = await connectionDB.query(

      'UPDATE solicitudes SET fecha_cierre = ? , estado = ? WHERE id_solicitud = ?;', [fecha_cierre,estado,id]);
   
    if(!update){
      return false
    }
    return update

  } catch (error) {
    throw{
      status:500,
      message:'Server Internal Error'
    }
  }
}

export async function getNotificacionestModel(){
  try {
    const connectionDB = await connectionDatabase()
    const [request] = await connectionDB.query('SELECT * FROM notificaciones ORDER BY fecha_solicitud desc')
    if(!request){
      throw{
        status:500,
        message:'Internal Server Error'
      }
    }
    return request
  } catch (error) {
    return error
  }}


  export async function createNotificationModel(data){
    try {
      if(!data){
        throw{
          status:400,
          message:'Ingrese los datos solicitados'
        }
      }
      const connectionDB = await connectionDatabase()
      const{expediente,referencia,solicitante,correo,fecha_solicitud} = data;
      const [createNotification] = await connectionDB.query(
        `INSERT INTO notificaciones (expediente,referencia,solicitante,correo,fecha_solicitud)
         VALUES (?,?,?,?,?)`,[expediente,referencia,solicitante,correo,fecha_solicitud]);

      if( !createNotification ){
        throw{
          status:500,
          message:'Ocurrio un error al registrar la solicitud, intente nuevamente'
        }}
      return createNotification
    } catch (error) {
      console.log(error)
     return error
    }
  }

  export async function createSolicitudModel(data){
    try {
      if(!data){
        throw{
          status:400,
          message:'Ingrese los datos solicitados'
        }}
      
      const connectionDB = await connectionDatabase()
      const{expediente,referencia,solicitante,correo,fecha_solicitud,estado} = data;
      const [createSolicitud] = await connectionDB.query(
        `INSERT INTO solicitudes (expediente,referencia,solicitante,correo,fecha_solicitud,estado)
         VALUES (?,?,?,?,?,?)`,[expediente,referencia,solicitante,correo,fecha_solicitud,estado]);

      if( !createSolicitud ){
        throw{
          status:500,
          message:'Ocurrio un error al registrar la solicitud, intente nuevamente'
        }}
      return createSolicitud
    } catch (error) {

      console.log(error)
     return error
    }
  }



  export const deleteNotificacionModel = async (id) =>{
    try {
      if(!id){
        throw{
          status:404,
          message:'Esta notificación no existe'
        }
      }
      const connectionDB = await connectionDatabase()
      const deleteExpedient = await connectionDB.query('DELETE notificaciones FROM notificaciones WHERE id_notificacion= ? ' ,[id]);

      if(!deleteExpedient){
        throw{
          status:500,
          message:'INTERNAL SERVER ERROR'
        }
      }
      return true
  
    } catch (error) {
      console.log(error)
      return error
    }
  }
  

  export const deletesRequestModel = async (id) =>{
    try {
      if(!id){
        throw{
          status:404,
          message:'Esta Solicitud no existe'
        }
      }
      const connectionDB = await connectionDatabase()
      const deleteExpedient = await connectionDB.query('DELETE solicitudes FROM solicitudes WHERE id_solicitud= ? ' ,[id]);
      if(!deleteExpedient){
        throw{
          status:500,
          message:'INTERNAL SERVER ERROR'
        }
      }
      return true
  
    } catch (error) {
      console.log(error)
      return error
    }
  }