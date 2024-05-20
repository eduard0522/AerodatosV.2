import { Router } from "express";
import { routerAuth } from "./auth.routes.js";
import { routerExp } from "./expedients.routes.js";
import {join, resolve,extname} from 'path'
import { readFileController } from "../../../controllers/xlsxController.js";
import { routerUser } from "./user.routes.js";
import { routerAdmin } from "./adminUser.routes.js";


export const router = Router();

router.use('/', routerAuth);
router.use('/user', routerUser);

router.use('/expedientes',routerExp);
router.use('/admin',routerAdmin );

router.get('/download', (req,res) =>{
  const ruta = join(resolve(),'./src/public/assets/plantilla','plantillaExpedientes.xlsx');
  res.download(ruta, function (error) {
    console.log("Error : ", error);
});
});

router.post('/uploadFile', readFileController );


/***************** ACTUALIZACIÓN DE BANNER  *********************/

router.post('/updateBanner', async (req,res) =>{
  try {
      const { banner }=  req.files
        if(!banner){
          return res.json({status:400,message:' no viene ningun archivo'})
        }
      const ext = extname(banner.name);
      const ext_permitidas = ['.webp','.png','.jpg','.jepg']
      if(!ext_permitidas.includes(ext)){
        return res.status(400).json({message:`Solo se permiten imagenes tu formato es : ${extname(banner.name)}`})
      }
      const ruta = join(resolve(),'./src/public/assets/banner','banner.webp');
      banner.mv(ruta , (error) => {
        if(error){
          console.log(error)
          return res.status(400).json({message:"ocurrio un error inesperado, intente de nuevo mas tarde."})
        }else{
          console.log(ruta)
          return res.send('ok') 
        }
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Ocurrio un error inesperado, intente de nuevo mas tarde."})
  }
  });
  
/******************* RUTAS DE REDIRECCION  **************/

router.get('/403',(req,res)=>{
  return res.render('page/403')
});

router.use('',(req,res,) =>{
  return res.render('page/404')
})



