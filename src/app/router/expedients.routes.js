import { Router } from "express";
import { deleteBoxController , getExpedientsController, newBoxController,newShelfController,deleteShelfController,newHallController,deleteHallController, newSerieController, deleteSerieController, newTypeController, deleteTypeController, newExpedientController, deleteExpedientController, upadateExpedientController,countExpedientsController } 
from "../../../controllers/expedients-controllers.js";

export const routerExp = Router();

/********************* EXPEDIENTES  **************/
routerExp.get("/", getExpedientsController );
routerExp.get("/total", countExpedientsController );

routerExp.post("/", newExpedientController);
// EDITAR EXPEDIENTE
routerExp.patch("/:id", upadateExpedientController);
//ELIMINAR EXPEDIENTE
routerExp.delete("/:id" , deleteExpedientController)

/************************** SERIES ******************/
// CREAR SERIE
routerExp.post('/serie', newSerieController);
// ELIMINAR SERIES
routerExp.delete('/serie/:id', deleteSerieController);

/************************** TIPO DOCUMENTO ******************/
// CREAR STIPO DOCUMENTO
routerExp.post('/tipo', newTypeController);
// ELIMINAR SERIES
routerExp.delete('/tipo/:id', deleteTypeController);

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

