import {deleteBoxService, getExpedientsService,newBoxService} from '../models/expedientsModel.js'

export async function getExpedientsController(req,res) {
  try {
        const expedients = await getExpedientsService();
        if(!expedients) {
          return res.status(500).json({
            message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
          })
        }
        return res.status(200).json(expedients);

  } catch (error) { 
    console.log(error)
    return res.status(500).json({
      message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
    })
  }
}




// ENVIA LOS DATOS Y LA SOLICITUD AL MODELO PARA INSERTAR UNA NUEVA CAJA

export async function newBoxController(req,res) {
    const {numero_caja} = req.body;
    if(!numero_caja) {
      return res.status(404).json({message:'Los datos estan incompletos, verifica la información e intenta de nuevo mas tarde'})
    }
    try {
        let boxString = numero_caja;
       if(typeof numero_caja != 'string'){
          boxString = numero_caja.toString();
      } 
      const newBox = await newBoxService(boxString);
      if(!newBox) {
          return res.status(500).json({
            message:'Ocurrio un error inesperado, intente de nuevo mas tarde'
            });
      }
      return res.status(200).json({
        message: 'Caja creada con exito' 
      });
  }catch(error){
      console.log(error);
  }
}


// ELIMINAR CAJA 

export async function deleteBoxController(req,res) {
  const{id} = req.params;
  if(!id){
    return res.status(404).json({message:'Número de caja no proporcionado'})
  }
  try {
   const deleteBox = await deleteBoxService(id);
   
   if(deleteBox){
    return res.status(200).json({message: 'Caja eliminada con éxito.'});
   }
   return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  }
}