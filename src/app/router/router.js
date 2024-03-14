import {Router} from 'express';
import { createExpedient, editExpedient, getExpedients, getExpedientsUser,deleteExpedient,getExpedientsUserE,getExpedientById } from '../../../controllers/expedients-controllers.js';
import { getRequest, updateRequest,getNotifications, createNotification, createSolicitud,deleteNotification, deleteRequest } from '../../../controllers/request-controller.js';
import { validateUser} from '../../../controllers/login.js';
import { validarTokenUser, validateTokens } from '../../../middleware/validateToken.js';


export const router  = Router();

router.get('/', (req,res) => {
 return res.render('page/login')
})
router.post('/login',validateUser);



/**************  Rutas para administrador ***********/

router.get('/admin/index', (req,res)=>{
  return res.render('page/index')
});

router.get('/admin/index/verify',validateTokens,validarTokenUser(['Administrador','administrador']), (req,res)=>{
  return res.render('page/index')
});

router.get('admin/index/:id', getExpedientById) 

/***************** SOLICITUDES DE CLIENTES ****************/

router.get('/solicitudes' , getRequest)
router.get('/solicitudes/veryfy' ,validateTokens,validarTokenUser(['Administrador','administrador']), getRequest);
router.post('/solicitudes',createSolicitud)
router.patch('/solicitudes/:id', updateRequest);
router.delete('/solicitudes/:id',deleteRequest)


router.get('/usuario' , getExpedientsUser);
router.get('/usuario/verify' ,validateTokens,validarTokenUser(['Administrador','administrador']), getExpedientsUser);


router.get('/base',getExpedients);
router.get('/base/veryfy',validateTokens,validarTokenUser(['Administrador','administrador']),getExpedients);
router.post('/expedientes',createExpedient);
router.patch('/expedientes/:id', editExpedient);
router.delete('/expedientes/:id',  deleteExpedient);


/**********************   USUARIO ******************/

router.get('/user/index', (req,res) => {
  return  res.render('page/indexUser');
});
router.get('/user/index/verify',validateTokens,validarTokenUser(['Administrador','administrador', 'Usuario','usuario']), (req,res)=>{
  return res.render('page/indexUser')
});

router.get('/user/expedientes' , getExpedientsUserE);
router.get('/user/expedientes/verify' ,validateTokens,validarTokenUser(['Administrador','administrador','Usuario','usuario']), getExpedientsUserE);

/******************** NOTIFICACIONES *************/

router.get('/notificaciones' , getNotifications);
router.post('/notificaciones',createNotification);
router.delete('/notificaciones/:id',deleteNotification);


/******************* RUTAS DE REDIRECCION  **************/


router.get('/403',(req,res)=>{
  return res.render('page/403')
});

router.use('',(req,res,) =>{
  return res.render('page/404')
})