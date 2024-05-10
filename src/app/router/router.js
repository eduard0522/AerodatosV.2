import { Router } from "express";
import { routerAuth } from "./auth.routes.js";
import { routerExp } from "./expedients.routes.js";

export const router = Router();

router.use('/', routerAuth);
router.use('/expedientes',routerExp)

/******************* RUTAS DE REDIRECCION  **************/

router.get('/403',(req,res)=>{
  return res.render('page/403')
});

router.use('',(req,res,) =>{
  return res.render('page/404')
})



