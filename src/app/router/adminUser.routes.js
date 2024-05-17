import { Router } from "express";

const routerAdmin = Router();

routerAdmin.get('/', getUsersController);
routerAdmin.post('/', createUserController);
routerAdmin.patch('/',updateUserController);
routerAdmin.delete('/', deleteUserController);
