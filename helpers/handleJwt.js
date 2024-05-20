import jwt from 'jsonwebtoken';

const secretPass = process.env.SECRET_PASS;

export function generateToken(data) {
 const newToken = jwt.sign(data,secretPass,{
    expiresIn: '8h'
  });
  return newToken;
}


export function validateAdminToken(req,res,next) {
  const {authorization} = req.headers;

  if(!authorization){
   return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
  }
  try {
    const decoded = jwt.verify(authorization,secretPass);
    if(decoded.rol != ('Administrador' && 'administrador' ) ){
      return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
    }

    if(decoded.exp < Date.now()/ 1000){
      return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
    }

    next();
  } catch(error) {
    console.log(error)
    return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
  }
}


export function validateToken(req,res,next){
    const {authorization} = req.headers;
    if(!authorization){
    return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
    }
    try{
      const decoded = jwt.verify(authorization,secretPass);
      if(!decoded.usuarioId){
        return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
      }
      if(decoded.exp < Date.now()/ 1000){
        return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
      }
      next();
    } catch(error) {
      console.log(error)
      return res.status(403).json({message:'No estas autorizado o el token ah expirado, debes iniciar sesión nuevamente.'})
    }
}


