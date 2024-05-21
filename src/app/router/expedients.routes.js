import { Router } from "express";
import { deleteBoxController , getExpedientsController, newBoxController,newShelfController,deleteShelfController,newHallController,deleteHallController, newExpedientController, deleteExpedientController, upadateExpedientController,countExpedientsController,getExpedientByExpedientController } 
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


/************************** CAJAS ******************/

// CREAR CAJA
routerExp.post('/caja', newBoxController);
// ELIMINAR CAJAS
routerExp.delete('/caja/:id', deleteBoxController);


/************************** PASILLOS ******************/

// CREAR PASILLO
routerExp.post('/pasillo', newHallController);
// ELIMINAR CAJAS
routerExp.delete('/pasillo/:id', deleteHallController);


/************************** ESTANTES ******************/
// CREAR ESTANTE
routerExp.post('/estante', newShelfController);
// ELIMINAR ESTANTE
routerExp.delete('/estante/:id', deleteShelfController);
