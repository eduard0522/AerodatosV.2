import { validateUser } from "../models/auth.js";
import { generateToken } from "../helpers/handleJwt.js";
import { decryptPass } from "../helpers/handleBcrypt.js";


export async function validateUserController (req,res){
    const { email,password} = req.body;
    if(!(email && password)){
       return  res.status(404).json({message:'Verifique la información e intentelo de nuevo!'})
    }
    try {
        const getUserData = await validateUser(email);

        if(!getUserData){
          return res.status(400).json({message:'Verifíca la informacion e intente de nuevo.'})
        }
        // COMPARAR CONTRASEÑA OBTENIDA CON LA GUARDADA
        const comparePass = await decryptPass(password, getUserData[0].clave);
        if(!comparePass)   return res.status(400).json({message:'Verifíca la informacion e intente de nuevo.'})
      
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

