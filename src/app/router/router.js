import { Router } from "express";
import { routerAuth } from "./auth.routes.js";
import { routerExp } from "./expedients.routes.js";
import {join, resolve} from 'path'
import { readFileController } from "../../../controllers/xlsxController.js";
import { routerUser } from "./user.routes.js";
import { routerAdmin } from "./adminUser.routes.js";


export const router = Router();

router.use('/', routerAuth);
router.use('/user', routerUser);

router.use('/expedientes',routerExp)
router.use('/admin',routerAdmin )

router.get('/download', (req,res) =>{
  const ruta = join(resolve(),'./src/public/assets/plantilla','plantillaExpedientes.xlsx');
  res.download(ruta, function (error) {
    console.log("Error : ", error)
});87
})

router.post('/uploadFile', readFileController )

/******************* RUTAS DE REDIRECCION  **************/

router.get('/403',(req,res)=>{
  return res.render('page/403')
});

router.use('',(req,res,) =>{
  return res.render('page/404')
})



