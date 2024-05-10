import { Router } from "express";
import { deleteBoxController, getExpedientsController, newBoxController } from "../../../controllers/expedients-controllers.js";

export const routerExp = Router();

routerExp.get("/", getExpedientsController );

/************************** CAJAS ******************/

// CREAR CAJA
routerExp.post('/caja', newBoxController);
// ELIMINAR CAJAS
routerExp.delete('/caja/:id', deleteBoxController);
