import { validateUserModel, validateTokenModel } from "../models/login.js";
import  jwt  from "jsonwebtoken";

export const validateUser = async (req, res) => {
  console.log('----------------------------------controller-----------------------------')
  try {
    const { userName, password } = req.body;
    const [user] = await validateUserModel(userName, password);
    if (!user) {
      res.json({ status: 401, message: "Usuario o clave incorrecta" });
    }
    const userForToken = {
      id: user.id_usuario,
      rol:user.rol,
    };

    const token = jwt.sign({ data: userForToken }, process.env.SECRET_PASS, {
      expiresIn: "5h",
    });
    res.json({
      status: "OK",
      data: { user: user.nombre_usuario, rol: user.rol, token },
      message: "Bienvenido al sistema",
    });

  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};



export const validateToken = async (req,res) => {
  console.log(req.headers)
  const {autorizathion} = req.headers;
  if(!autorizathion){
    return res.json({ status:400,message:'No estas Autorizado'})
  }

  try {
    const decriptToken = jwt.verify(autorizathion, process.env.SECRET_PASS);

    const validation = await validateTokenModel(decriptToken.data.id);

    const rol = decriptToken.data.rol

    if (!validation) {
      res.json({ status: 401, message: "Usuario o clave incorrecta" });
    }

    res.json({ status: 200, data:rol });

  } catch (error) {
    console.log(error);
    res.json({
      status: error?.status || 401,
      message: error?.message || "No estas autorizado",
    });
  }
}