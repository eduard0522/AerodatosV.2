import { Router } from "express";
import { getUsersController,createUserController,updateUserController,deleteUserController } from "../../../controllers/adminController.js";

export const routerAdmin = Router();

routerAdmin.get('/', getUsersController);
routerAdmin.post('/', createUserController);
routerAdmin.patch('/:id',updateUserController);
routerAdmin.delete('/:id', deleteUserController);
