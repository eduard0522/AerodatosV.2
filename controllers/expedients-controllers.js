import { createExpedientModel, editExpedientModel, getExpedientsModel,deleteExpedientModel,getExpedientByIdModel } from "../models/expedients-model.js";
import { validateExpedient,validatePartialExpedient } from "../schemas/expedients.js";
import { connectionDatabase} from "../db/index.js"

export async function getExpedients(req, res) {
  try {
    // Llama a la función para obtener expedientes desde el modelo
    const expedients = await getExpedientsModel();

    // Verifica si se obtuvieron expedientes
    if (!expedients || expedients.length === 0) {
      throw {
        status: 500,
        message: 'No se logró obtener los expedientes, inténtelo más tarde.'
      };
    }

    // Renderiza la vista con los expedientes
    res.render('page/base', { expedientes: expedients });
  } catch (error) {
    // Maneja los errores y envía una respuesta JSON en caso de error
    res.status(error?.status || 500).json({
      status: error?.status || 500,
      message: error?.message || 'Error interno del servidor.'
    });
  }
}

export async function getExpedientById(req, res) {
  try {

   const {id} = req.query 
    // Llama a la función para obtener expedientes desde el modelo
    const expedient = await getExpedientByIdModel(id);

    // Verifica si se obtuvieron expedientes
    if (!expedient || expedient.length === 0) {
      throw {
        status: 500,
        message: 'No se logró obtener el expediente, inténtelo más tarde.'
      };
    }

    res.json({status:200, message:'Expediente encontrado', data:expedient})
    
  } catch (error) {
    // Maneja los errores y envía una respuesta JSON en caso de error
    res.status(error?.status || 500).json({
      status: error?.status || 500,
      message: error?.message || 'Error interno del servidor.'
    });
  }
}
  
  
// Función asincrónica para obtener expedientes de un usuario
export async function getExpedientsUser(req, res) {
  try {
    // Realiza la consulta a la base de datos para obtener los expedientes
    const connectionDB = await connectionDatabase()
    const [expedients] = await connectionDB.query('SELECT * FROM ubicacion_expediente');

    // Renderiza la vista con los expedientes obtenidos
    res.render('page/usuario', { expedientes: expedients });
  } catch (error) {
    // Maneja los errores y envía una respuesta JSON en caso de error
    res.status(500).json({
      status: 500,
      message: 'Error interno del servidor: ' + error.message
    });
  }
}



export async function getExpedientsUserE(req,res){
  try {
    const connectionDB = await connectionDatabase()
    const [expedients] =  await connectionDB.query('SELECT * FROM ubicacion_expediente')
    return res.render('page/expedientUser',{expedientes:expedients})
  } catch (error) {
    console.error(error);
    return res.status(error?.status || 500).json({
      status: error?.status || 500,
      message: error?.message || "Error interno del servidor"
    });
  }
 
}


export async function createExpedient(req, res) {
  console.log(">>>>>>>>>>>>>>>>>>>>>< CONTROLADOR <<<<<<<<<<<<<<<<<<<<<<")
  try {
    // Validar los datos del expediente utilizando una función de validación
    const validateSchema = validateExpedient(req.body);

    // Verificar si hay errores de validación
    if (validateSchema.error) {
      return res.status(421).json({ error: JSON.parse(validateSchema.error.message) });
    }

    // Crear un nuevo expediente utilizando una función del modelo
    const newExpedient = await createExpedientModel({ input: validateSchema.data });

    // Verificar si se pudo crear el expediente
    if (!newExpedient) {
      throw {
        status: 421,
        message: 'No se logró crear el expediente. Revise los datos ingresados e intente de nuevo.'
      };
    }

    // Enviar una respuesta con estado 200 y el nuevo expediente creado
    res.status(200).json({ status: 200, message: 'Registro Exitoso', data: newExpedient });

  } catch (error) {
    // Manejar los errores y enviar una respuesta JSON con el código de estado y el mensaje de error correspondiente
    console.error(error);
    res.status(error?.status || 500).json({
      status: error?.status || 500,
      message: error?.message || "Error interno del servidor"
    });
  }
}


export async function editExpedient(req,res) {
  console.log('<<<<<<<<<<<<< Controlador de Editar >>>>>>>>>><')
  try {
    const {id} =  req.params;
    if(!id){
      throw{
        status:404,
        messasge:'Este expediente no existe'
      }
    }

    const validateSchema  = validatePartialExpedient(req.body)  
    if(validateSchema.error){
      return res.status(421).json({ error: JSON.parse(validateSchema.error.message)});
    }


    const result =  await editExpedientModel(validateSchema.data,id);

    if(!result){
      throw{
        status:500,
        messasge:'Ocurrio un error en el sistema, intente de nuevo mas tarde'
      }
    }

    return res.json({status:'OK',message:' ¡¡ Actualización Exitosa !!'})
    
  } catch (error) {
    console.log(error)
    res.json({error: error.status || 500, message: error.message || 'Internal Server Error'})
  }
}



export async function  deleteExpedient(req,res) {
  try {
    const {id} = req.params
    if(!id){
      throw{
        status:404,
        message:'Este registro no existe'
      }
    }

  const result = await deleteExpedientModel(id);
    if(!result){
      throw{
        status:500,
        message:'INTERNAL SERVER ERROR'
      }
    }
    res.json({status:200, message:'Registro eliminado con exito'});
  } catch (error) {
    res.json({status:error.status || 500, message: error.message || 'INTERNAL SERVER ERROR' })
  }
}
