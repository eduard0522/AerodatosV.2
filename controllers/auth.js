import { validateUser } from "../models/auth.js";
import { generateToken } from "../helpers/handleJwt.js";


export async function validateUserController (req,res){
    const { userName, password} = req.body;
    if(!(userName && password)){
       return  res.status(404).json({message:'Verifique la información e intentelo de nuevo!'})
    }
    try {
      console.log(userName,password)
      const getUserData = await validateUser(userName,password);
      if(!getUserData){
        return res.status(404).json({message:'Datos incorrectos,Verifique la información e intentelo de nuevo!'});
      }
      // GENERAR TOKEN
      const dataToken = {
        usuarioId : getUserData[0].id_usuario,
        rol : getUserData[0].rol
      }
      const token =  generateToken(dataToken);
      return res.status(200).json({message:'Inicio de sesión exitoso, bienvenido de vuelta!!', Usuario:getUserData, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde.'})
    }
}

