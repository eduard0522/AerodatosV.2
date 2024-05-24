import { getUsersService, createUserService,updateUserService, deleteUsersService } from "../models/adminModel.js";
import { getuuid } from "../helpers/handeUUID.js";
import { encryptPass } from "../helpers/handleBcrypt.js";
//  OBTENER USUARIOS

export async function getUsersController(req,res) {
  try {
      const getUsers = await getUsersService()
      if(!getUsers || getUsers.error){
        return res.status(400).json({message:getUsers.error? getUsers.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde'});
      }
      return res.status(200).json(getUsers)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
  }
}

// CREAR USUARIOS

export async function createUserController(req,res) {
    const{name,email,password,rol} = req.body
    if(!(name && email && password && rol)){
      return res.status(400).json({message:"Los datos son incompletos, verifica la información e intenta de nuevo."});
    }
  try {
      // Obtener UUID
      const uuid =  await getuuid();
      //Encriptacion de password
      const passHash = await encryptPass(password);

      // Si el uuid y las contraseña encriptada es correcto, envia los datos para crear el usuario
      if( uuid && passHash){
          const data = { uuid,name,email,passHash,rol}
          const newUser = await createUserService(data);
          if(!newUser || newUser.error){
            return res.status(400).json({message:newUser.error? newUser.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde'});
          }
          return res.status(200).json({message:'Usuario creado exitosamente.'});
      }

     return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
      
  } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
  }
} 

// ACTUALIZAR USUARIO
export async function updateUserController(req,res) {
      const{name,email,password,rol} = req.body
      const {id} = req.params
      if(!(name && email && password && rol)){
          return res.status(400).json({message:"Los datos son incompletos, verifica la información e intenta de nuevo."})
      }
    try {
        //encriptacion de clave
        const passHash = await encryptPass(password);

        const data = {name,email,passHash,rol}
        const newUser = await updateUserService(id,data);

        if(!newUser || newUser.error){
          return res.status(500).json({message:newUser.error? newUser.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde'});
        }
        return res.status(200).json({message:'Usuario editado exitosamente.'});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
    }
} 

// ELIMINAR USUARIO
export async function deleteUserController(req,res) {
  try {
       const {id} = req.params
       if(!id){
        return res.status(400).json({message:'No se encontro el usuario.'})
       }
      const deleteUser = await deleteUsersService(id)
      if(!deleteUser || deleteUser.error){
        return res.status(500).json({message:deleteUser.error? deleteUser.error : 'Ocurrio un error inesperado, intente de nuevo mas tarde'});
      }
      return res.status(200).json({message:'Usuario eliminado exitosamente.'})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
  }
}

