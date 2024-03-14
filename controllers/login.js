import { secret_pass } from "../src/config.js"
import { validateUserModel } from "../models/login.js";
import  jwt  from "jsonwebtoken";



export const validateUser = async (req, res) => {
  console.log('----------------------------------controller-----------------------------')
  try {
      const { userName, password } = req.body;
      const [user] = await validateUserModel(userName, password);
      if (!user || user.length === 0) {
      return res.json({ status: 401, message: "Usuario o clave incorrecta" });
      }
      const userForToken = {
        id: user.id_usuario,
        rol:user.rol,
      };

      const token = jwt.sign({ data: userForToken },secret_pass, {
        expiresIn: "5h",
      });
      return res.json({
        status: "OK",
        data: { rol: user.rol, token },
        message: "Bienvenido al sistema",
      });

  } catch (error) {
      console.log(error)
    return res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};
