import { Router } from "express";
import { validateUserController } from "../../../controllers/auth.js";
import { validateAdminToken, validateToken } from "../../../helpers/handleJwt.js";

export const routerAuth = Router();

routerAuth.get('/' , (req,res) => {
  res.render('page/login')
});

routerAuth.get('/index',(re,res) =>{
  res.render('page/index')
});

routerAuth.get('/verifytoken', validateAdminToken , (req,res) => {
  return res.status(200).json({message:'OK'})
});

routerAuth.get('/verifytokenUser', validateToken , (req,res) => {
  return res.status(200).json({message:'OK'})
});

routerAuth.post('/login', validateUserController);


