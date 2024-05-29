import { Router } from "express";
import {  getExpedientsController,newHallController,deleteHallController, newExpedientController, deleteExpedientController, upadateExpedientController,countExpedientsController,getExpedientByExpedientController } 
from "../../../controllers/expedients-controllers.js";

export const routerExp = Router();

/********************* EXPEDIENTES  **************/
routerExp.get("/", getExpedientsController ); 

 routerExp.get("/total", countExpedientsController ); 

routerExp.get("/filter/", getExpedientByExpedientController);

routerExp.get("/:page", getExpedientsController ); 

routerExp.post("/", newExpedientController);
// EDITAR EXPEDIENTE
routerExp.patch("/:id", upadateExpedientController);
//ELIMINAR EXPEDIENTE
routerExp.delete("/:id" , deleteExpedientController)


// CREAR PASILLO
routerExp.post('/pasillo', newHallController);
// ELIMINAR CAJAS
routerExp.delete('/pasillo/:id', deleteHallController);

