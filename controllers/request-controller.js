
import { getRequestModel,updateRequestModel,getNotificacionestModel,createNotificationModel,createSolicitudModel,deleteNotificacionModel, deletesRequestModel } from "../models/request-model.js";

export async function getRequest(req,res) {
try {
  const request = await getRequestModel();

  if(!request){
    throw{
      status:404,
      message:'No existe este expediente'
    }}

  res.render('page/solicitudes',{solicitudes:request});
} catch (error) {
  return res.json({status: error.status || 500 , message: error.message || 'INTERNAL SERVER ERROR'})
}
  
}


export async function updateRequest(req,res){
  try {
    const{id} = req.params
    if(!id){
      throw{
        status:404,
        message:'No existe este expediente'
      }
    }
    const {fecha_cierre,estado} = req.body
    const data = {fecha_cierre,estado};
    const result = await updateRequestModel(data,id);
    if(!result){
   
      throw{
        status:500,
        message:'Internal Server Error'
      } }
    return res.json({status:200,message:'¡¡Actualización Exitosa!!'});
  } catch (error) {
    return res.json({status: error.status || 500 , message: error.message || 'INTERNAL SERVER ERROR'})
  }
} 



export async function getNotifications(req,res) {
  try {
    const request = await getNotificacionestModel();
    if(!request){
      throw{
        status:404,
        message:'Not Found'
      }}
    res.json({status: 200 , message:'Petición exitosa', data:request});
  } catch (error) {
    return res.json({status: error.status || 500 , message: error.message || 'INTERNAL SERVER ERROR'})
  }
}

export async function createNotification(req,res) {
  try {
    const result = await createNotificationModel(req.body)
    if(!result.affectedRows || result.affectedRows ===  0){
      throw{
        status:500,
        message:'Ocurrio un error al enviar la solicitud, intente de nuevo'
      }} 

  res.json({status:200,message:'Solicitud enviada correctamente'})
  } catch (error) {
    console.log(error)
    res.json({
      status: error.status || 500,
      message:error.message || 'INTERNAL SERVER ERROR'
    })
  }
}


export async function createSolicitud(req,res) {
  try {
    const result = await createSolicitudModel(req.body)
    if(!result.affectedRows || result.affectedRows ===  0){
      throw{
        status:500,
        message:'Ocurrio un error al enviar la solicitud, intente de nuevo'
      }} 

  res.json({status:200,message:'Solicitud enviada correctamente'})
  } catch (error) {
    
    console.log(error)
    res.json({
      status: error.status || 500,
      message:error.message || 'INTERNAL SERVER ERROR'
    })
  }
}


export async function  deleteNotification(req,res) {
  try {
    const {id} = req.params
    if(!id){
      throw{
        status:404,
        message:'Este registro no existe'
      }
    }
    const result = await deleteNotificacionModel(id);
    if(!result){
      throw{
        status:500,
        message:'INTERNAL SERVER ERROR'
      }
    }
    res.json({status:200, message:'Notificación eliminada con exito'});
  } catch (error) {
    res.json({status:error.status || 500, message: error.message || 'INTERNAL SERVER ERROR' })
  }
}



export async function  deleteRequest(req,res) {
  try {
    const {id} = req.params
    if(!id){
      throw{
        status:404,
        message:'Este registro no existe'
      }
    }
    const result = await deletesRequestModel(id);
    if(!result){
      throw{
        status:500,
        message:'INTERNAL SERVER ERROR'
      }
    }
    res.json({status:200, message:'Solicitud eliminada con exito'});
  } catch (error) {
    res.json({status:error.status || 500, message: error.message || 'INTERNAL SERVER ERROR' })
  }
}