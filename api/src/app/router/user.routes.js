import { Router } from "express";
import { getExpedientsUserController } from "../../../controllers/expedients-controllers.js";
import { getExpedientUserByExpedientController } from "../../../controllers/expedients-controllers.js";
export const routerUser = Router()

routerUser.get('/index', (re,res) =>{
  res.render('page/indexUser')
});

routerUser.use('/expedientes',getExpedientsUserController);
routerUser.get("/expedientes/:page", getExpedientsUserController); 
routerUser.get("/filter/", getExpedientUserByExpedientController);