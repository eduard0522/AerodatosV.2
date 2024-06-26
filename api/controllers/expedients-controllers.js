import {
   getExpedientsService, newHallService,deleteHallService, newExpedientService, deleteExpedientService,updateExpedientService,countExpedientsService,getExpedientByExpedientService
  } 
  from '../models/expedientsModel.js';
  
import { validateExpedientForm , validatePartialExpedientForm} from '../schemas/expedients.js';


  /************************** EXPEDIENTES  *********************/

  // Trae los expedientes de la base de datos por pagina y limite de datos

export async function getExpedientsController(req,res) {
  try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page -1 ) * limit;
        const expedients = await getExpedientsService(limit, offset);
        if(!expedients || expedients.error) {
          return res.status(500).json({
            message: expedients.error ? expedients.error :  'Ocurrio un error inesperado, intente de nuevo mas tarde.'
          });
        }
        
        let pages = Math.ceil((expedients.totalExpedients.total)/limit ) ;

        return res.render('page/base',{expedientes: expedients.expedients , pages });
  } catch (error) { 
      console.log(error)
      return res.status(500).json({
        message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
      })
  }
}


// Trae los expedientes de la base de datos por pagina  y renderiza la vista de ususario

export async function getExpedientsUserController(req,res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page -1 ) * limit;
    const expedients = await getExpedientsService(limit, offset);
    if(!expedients || expedients.error) {
      return res.status(500).json({
        message: expedients.error ? expedients.error :  'Ocurrio un error inesperado, intente de nuevo mas tarde.'
      });
    }
    let pages = Math.ceil((expedients.totalExpedients.total)/limit ) ;
    return res.render('page/expedientUser',{expedientes: expedients.expedients , pages });

  } catch (error) { 
    console.log(error)
    return res.status(500).json({
      message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
    });
  }
} 

  // Cuenta el total de expedientes, los que estan organizados y los que estan sin organizar 

  export async function countExpedientsController(req,res) {
    try {
          const expedients = await countExpedientsService();
          if(!expedients || expedients.error) {
            return res.status(500).json({
              message: expedients.error ? expedients.error :  'Ocurrio un error inesperado, intente de nuevo mas tarde.'
            });
          }
          return res.status(200).json(expedients);

    } catch (error) { 
      console.log(error)
      return res.status(500).json({
        message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'
      });
    }
  }



  //OBTIENE UN EXPEDIENTE POR NUMERO DE EXPEDIENTE

  export async function getExpedientByExpedientController(req,res) {
  
    const {expedient , name} = req.query

    if(!name && !expedient){
      return res.status(400).json({message:'No se encontro ningun registro.'});
    }
    try {
      if(name && !expedient){
            const expedient = await getExpedientByExpedientService( null , name);

            if(!expedient || expedient.error) {
                 return res.status(500).json({message:expedient.error ? expedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'})
            }

            return res.render('page/base',{expedientes:expedient});
      }
      if(!name && expedient){

          const getExpedient = await getExpedientByExpedientService(expedient, null);
          if(!getExpedient|| getExpedient.error) {
            return res.status(500).json({message:getExpedient.error ? getExpedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'})
          }
          return res.render('page/base',{expedientes:getExpedient});
      }
      if(expedient && name ){
        const getExpedient = await getExpedientByExpedientService(expedient,name);
        if(!getExpedient|| getExpedient.error) {
          return res.status(500).json({message:getExpedient.error ? getExpedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'})
        }
        return res.render('page/base',{expedientes:getExpedient});
      }
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    }
  }



   //OBTIENE UN EXPEDIENTE POR NUMERO DE EXPEDIENTE Y RENDERIZA LA VISTA DEL USUARIO

   export async function getExpedientUserByExpedientController(req,res) {

    const {expedient , name} = req.query

    if(!name && !expedient){
      return res.status(400).json({message:'No se encontro ningun registro.'});
    }

    try {
      if(name && !expedient){
            const getExpedient = await getExpedientByExpedientService( null , name);
            if(!getExpedient || getExpedient.error) {
                 return res.status(500).json({message:getExpedient.error ? getExpedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
             }
             return res.render('page/expedientUser',{expedientes:expedient});

      }
      if(!name && expedient){
          const getExpedient = await getExpedientByExpedientService(expedient, null);
          if(!getExpedient|| getExpedient.error) {
           return res.status(400).json({message:getExpedient.error ? getExpedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
          }
          return res.render('page/expedientUser',{expedientes:getExpedient});
      }
      if(expedient && name ){
        const getExpedient = await getExpedientByExpedientService(expedient,name);

        if(!getExpedient|| getExpedient.error) {
          return res.status(400).json({message:getExpedient.error ? getExpedient.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
        }
        return res.render('page/expedientUser',{expedientes:getExpedient});
      }


      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Ocurrio un error inesperado, intente de nuevo mas tarde.'});
    }
  }



//  ENVIA LA INFORMACIÓN PARA CREAR UN NUEVO EXPEDIENTE

 export async function newExpedientController(req,res) {
  
    const {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = req.body;
    if(!nombre || !numero  || !nombre_serie || !caja || !estante || !pasillo){

      return res.status(404).json({message:'Los datos estan incompletos '});
    }
    try {
        const dataExpedient = { nombre ,numero,nombre_serie,estado , caja , estante , pasillo}

        const validateTypes = validateExpedientForm(dataExpedient);
        if(!validateTypes || validateTypes.error){

          return res.status(404).json({message: validateTypes.error.message?validateTypes.error.message : 'Verifica los datos e intenta de nuevo.'});
        }

        const result = await newExpedientService(validateTypes.data);

        if(!result || result.error){
          return res.status(404).json({
            message:result.error ? result.error : 'Ocurrió un error inesperado, intente de nuevo mas tarde'
          })
        }
        return  res.status(200).json({message:'Expediente creado con éxito.'});

    } catch (error) {
      console.log(error)
      return  res.status(500).json({message: error.message?error.message : 'Ocurrio un error inesperado, intentalo de nuevo mas tarde.'})
    }
}  


//  ENVIA LA INFORMACIÓN PARA EDITAR UN EXPEDIENTE

export async function upadateExpedientController(req,res) {
  
  const {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = req.body;
  const {id} = req.params;
  if(!id, !nombre || !numero || !caja || !estante || !pasillo){
    return res.status(404).json({message:'Los datos estan incompletos '});
  }

  try {
      const dataExpedient = { nombre ,numero,nombre_serie, estado, caja , estante , pasillo}

      const validateTypes = validatePartialExpedientForm(dataExpedient);

      if(!validateTypes || validateTypes.error){
        return res.status(404).json({message: validateTypes.error.message?validateTypes.error.message : 'Verifica los datos e intenta de nuevo.'});
      }

      const result = await updateExpedientService(id,validateTypes.data);

       if(!result || result.error){
          return res.status(400).json({
            message:result.error ? result.error : 'Ocurrió un error inesperado, intente de nuevo mas tarde'
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
      if(!result || result.error){
        return res.status(400).json({
          message:result.error ? result.error : 'Ocurrió un error inesperado, intente de nuevo mas tarde'
        });
      }
      return  res.status(200).json({message:'Registro eliminado con éxito.'});
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Ourrio un error inesperado, intenta de nuevo mas tarde.'});
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
    if(!newHall || newHall.error) {
        return res.status(500).json({
          message: newHall.error ?  newHall.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde'
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

