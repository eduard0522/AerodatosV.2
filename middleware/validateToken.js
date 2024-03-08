import { validateTokenModel } from "../models/login.js";
import  jwt  from "jsonwebtoken";

export const validateTokens = async (req,res,next) => {

  console.log(req.headers)
  const {autorizathion} = req.headers;
  if(!autorizathion){
    return res.json({ status:403,message:'No estas Autorizado'})
  }

  try {
    const decriptToken = jwt.verify(autorizathion, process.env.SECRET_PASS);

    const validation = await validateTokenModel(decriptToken.data.id);

    const rol = decriptToken.data.rol

    if (!validation) {
      res.json({ status: 401, message: "Usuario o clave incorrecta" });
    }
    
    res.json({status:200,rol})

  } catch (error) {
    console.log(error);
    res.json({
      status: error?.status || 401,
      message: error?.message || "No estas autorizadillo",
    });
  }
}