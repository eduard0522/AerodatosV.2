import {
  deleteBoxService, getExpedientsService,newBoxService, newHallService,deleteHallService,newShelfService,deleteShelfService, newSerieService, deleteSerieService, deleteTypeService,newTypeService , newExpedientService, deleteExpedientService,updateExpedientService,countExpedientsService
  } 
  from '../models/expedientsModel.js';


  /************************** EXPEDIENTES  *********************/

  // Trae todos los expedientes de la base de datos

export async function getExpedientsController(req,res) {
  try {
        const expedients = await getExpedientsService();
        if(!expedients || expedients.error) {
          return res.status(500).json({
            message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
          })
        }
        return res.render('page/base',{expedientes: expedients});
  } catch (error) { 
    console.log(error)
    return res.status(500).json({
      message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
    })
  }
}

  // Cuenta el total de expedientes, los que estan organizados y los que estan sin organizar 

  export async function countExpedientsController(req,res) {
    try {
          const expedients = await countExpedientsService();
          if(!expedients || expedients.error) {
            return res.status(500).json({
              message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
            });
          }
          return res.status(200).json(expedients);
    } catch (error) { 
      console.log(error)
      return res.status(500).json({
        message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
      })
    }
  }
  
//  ENVIA LA INFORMACIÓN PARA CREAR UN NUEVO EXPEDIENTE

 export async function newExpedientController(req,res) {
  
    const {nombre,numero,tipo,estado,numero_serie,nombre_serie,caja,estante,pasillo} = req.body;
    if(!nombre || !numero ||  !tipo  || !nombre_serie || !numero_serie || !caja || !estante || !pasillo){
      console.log(req.body)
      return res.status(404).json({message:'Los datos estan incompletos '});
    }
    try {
        const dataExpedient = { nombre ,numero,nombre_serie, tipo, estado , numero_serie , caja , estante , pasillo}
        const result = await newExpedientService(dataExpedient);

        if(!result){
          return res.status(404).json({
            message:'Parece que este expediente ya existe'
          })
        }
        return  res.status(200).json({message:'Expediente creado con éxito.'})
    } catch (error) {
      console.log(error)
      return  res.status(500).json({message: error.message?error.message : 'Ocurrio un error inesperado, intentalo de nuevo mas tarde.'})
    }
}  


//  ENVIA LA INFORMACIÓN PARA EDITAR UN EXPEDIENTE

export async function upadateExpedientController(req,res) {
  
  const {nombre,numero,tipo,estado,numero_serie,nombre_serie,caja,estante,pasillo} = req.body;
  const {id} = req.params;
  if(!id, !nombre || !numero ||  !tipo  || !nombre_serie || !numero_serie || !caja || !estante || !pasillo){
    console.log(req.body)
    return res.status(404).json({message:'Los datos estan incompletos '});
  }

  try {
      const dataExpedient = {id, nombre ,numero,nombre_serie, tipo, estado , numero_serie , caja , estante , pasillo}
      const result = await updateExpedientService(dataExpedient);

      if(!result){
        return res.status(404).json({
          message:'Algo ha salido mal, intenta de nuevo mas tarde'
        })
      }
      return  res.status(200).json({message:'Expediente editado con éxito.'})
  } catch (error) {
    console.log(error)
    return  res.status(500).json({message: error.message?error.message : 'Ocurrio un error inesperado, intentalo de nuevo mas tarde.'})
  }
}  

/*********************** ELIMINAR EXPEDIENTE POR ID  ********************/ 

export async function deleteExpedientController(req,res) {
    const {id} = req.params;
    if(!id){
      return res.status(404).json({message :'Los datos son incompletos, verifica la información e intentalo nuevamente.'})
    }
    try {
      const result = await deleteExpedientService(id);
      if(!result){
        return res.status(500).json({message:'Ourrio un error inesperado, intenta de nuevo mas tarde.'});
      }
      return  res.status(200).json({message:'Registro eliminado con éxito.'});

    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Ourrio un error inesperado, intenta de nuevo mas tarde.'});
    }
}

/************************************** SERIES ******************************/

// ENVIA LOS DATOS Y LA SOLICITUD AL MODELO PARA INSERTAR UNA NUEVA SERIE

export async function newSerieController(req,res) {
  const {numero_serie, nombre_serie} = req.body;
  if(!(numero_serie && nombre_serie)) {
    return res.status(404).json({message:'Los datos estan incompletos, verifica la información e intenta de nuevo mas tarde'})
  }
  try {

    const newSerie = await newSerieService(numero_serie,nombre_serie);
    if(!newSerie) {
        return res.status(500).json({
          message:'Ocurrio un error inesperado, intente de nuevo mas tarde'
          });
    }
    return res.status(200).json({
      message: 'Serie creada con éxito' 
    });
}catch(error){
    console.log(error);
}
}

// ELIMINAR SERIE

export async function deleteSerieController(req,res) {
  const{id} = req.params;
  if(!id){
    return res.status(404).json({message:'Número de serie a eliminar no proporcionado'})
  }
  try {
      const deleteSerie = await deleteSerieService(id);
      
      if(deleteSerie){
        return res.status(200).json({message: 'Serie eliminada con éxito.'});
      }
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  } catch (error) {
      console.log(error);
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  }
}

/************************************** TIPOS DE DOCUMENTO  ******************************/

// ENVIA LOS DATOS Y LA SOLICITUD AL MODELO PARA INSERTAR UN NUEVO TIPO

export async function newTypeController(req,res) {
  const {nombre_tipo} = req.body;
  if(!(nombre_tipo)) {
    return res.status(404).json({message:'Los datos estan incompletos, verifica la información e intenta de nuevo mas tarde'})
  }
  try {

    const newType = await newTypeService(nombre_tipo);
    if(!newType) {
        return res.status(500).json({
          message:'Ocurrio un error inesperado, intente de nuevo mas tarde'
          });
    }
    return res.status(200).json({
      message: 'Tipo documental creado con éxito' 
    });
}catch(error){
    console.log(error);
}
}

// ELIMINAR TIPO

export async function deleteTypeController(req,res) {
  const{id} = req.params;
  if(!id){
    return res.status(404).json({message:'id de tipo a eliminar no proporcionado'})
  }
  try {
      const deleteType = await deleteTypeService(id);
      
      if(deleteType){
        return res.status(200).json({message: 'Tipo de documento eliminado con éxito.'});
      }
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  } catch (error) {
      console.log(error);
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
  }
}

/*******************************  CAJAS  **************************/

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

/************************************** PASILLOS  ******************************/

// ENVIA LOS DATOS Y LA SOLICITUD AL MODELO PARA INSERTAR UN NUEVO PASILLO

export async function newHallController(req,res) {
  const {numero_pasillo} = req.body;
  if(!numero_pasillo) {
    return res.status(404).json({message:'Los datos estan incompletos, verifica la información e intenta de nuevo mas tarde'})
  }
  try {
      let hallString = numero_pasillo;
     if(typeof numero_pasillo != 'string'){
        hallString = numero_pasillo.toString();
    } 
    const newHall = await newHallService(hallString);
    if(!newHall) {
        return res.status(500).json({
          message:'Ocurrio un error inesperado, intente de nuevo mas tarde'
          });
    }
    return res.status(200).json({
      message: 'Pasillo creado con exito' 
    });
}catch(error){
    console.log(error);
}
}
// ELIMINAR PASILLO

export async function deleteHallController(req,res) {
const{id} = req.params;
if(!id){
  return res.status(404).json({message:'Número de pasillo no proporcionado'})
}
try {
 const deleteHall = await deleteHallService(id);
 
 if(deleteHall){
  return res.status(200).json({message: 'Pasillo eliminado con éxito.'});
 }
 return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
} catch (error) {
  console.log(error);
  return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
}
}



/************************************** ESTANTES ******************************/

// ENVIA LOS DATOS Y LA SOLICITUD AL MODELO PARA INSERTAR UN NUEVO ESTANTE

export async function newShelfController(req,res) {
    const {numero_estante} = req.body;
    if(!numero_estante) {
      return res.status(404).json({message:'Los datos estan incompletos, verifica la información e intenta de nuevo mas tarde'})
    }
    try {
  
      const newShelf = await newShelfService(numero_estante);
      if(!newShelf) {
          return res.status(500).json({
            message:'Ocurrio un error inesperado, intente de nuevo mas tarde'
            });
      }
      return res.status(200).json({
        message: 'Estante creado con exito' 
      });
  }catch(error){
      console.log(error);
  }
}

// ELIMINAR ESTANTE

export async function deleteShelfController(req,res) {
    const{id} = req.params;
    if(!id){
      return res.status(404).json({message:'Número de estante no proporcionado'})
    }
    try {
        const deleteShelf= await deleteShelfService(id);
        
        if(deleteShelf){
          return res.status(200).json({message: 'Estante eliminado con éxito.'});
        }
        return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    }
}