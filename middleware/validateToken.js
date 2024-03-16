
import  jwt  from "jsonwebtoken";

export const validateTokens = async (req,res,next) => {
  
  try {
      const {autorizathion} = req.headers;
      if(!autorizathion){
          return res.json({status:403,message:'No estas autorizado'});
      }
      const decriptToken = jwt.verify(autorizathion, process.env.SECRET_PASS);
      if(!decriptToken.data.id){
        return res.json({status:403,message:'No estas autorizado'});
      }
      next()
  } catch (error) {
      console.log(error);
      return res.json({status:403,message:'No estas autorizado'});
  }
}


export const validarTokenUser = (roles) => async (req,res,next)=>{
  try {
     const {autorizathion} = req.headers;
     const decriptToken = jwt.verify(autorizathion, process.env.SECRET_PASS);
     const rol = decriptToken.data.rol
     const validateUser = roles.find((user) => user === rol); 
     if(validateUser){
  
      return next()
     }

    return res.json({status:403,message:'No estas autorizado'}); 

  } catch (err) {
    return res.json({status:403,message:'No estas autorizado'});
  }
}