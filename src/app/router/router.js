import {Router} from 'express';
import { createExpedient, editExpedient, getExpedients, getExpedientsUser,deleteExpedient,getExpedientsUserE } from '../../../controllers/expedients-controllers.js';
import { getRequest, updateRequest,getNotifications, createNotification, createSolicitud,deleteNotification, deleteRequest } from '../../../controllers/request-controller.js';
import { validateUser,validateToken } from '../../../controllers/login.js';
import { validateTokens } from '../../../middleware/validateToken.js';



export const router  = Router();

router.get('/', (req,res) => {
  res.render('page/login')
})

router.post('/login',validateUser);

router.get('/token',validateToken);

router.get('/validateToken',validateTokens);

router.get('/admin/index', (req,res,next) => {
  res.render('page/index');
  next();
});

router.get('/user/index', (req,res,next) => {
  res.render('page/indexUser');
  next();
});

router.get('/solicitudes' , getRequest);
router.post('/solicitudes',createSolicitud)
router.patch('/solicitudes/:id', updateRequest);
router.delete('/solicitudes/:id',deleteRequest)

router.get('/usuario' , getExpedientsUser);
router.get('/user/expedientes' , getExpedientsUserE);

router.get('/base',getExpedients);



router.post('/expedientes',createExpedient);
router.patch('/expedientes/:id', editExpedient);
router.delete('/expedientes/:id',  deleteExpedient);



router.get('/notificaciones' , getNotifications);
router.post('/notificaciones',createNotification);
router.delete('/notificaciones/:id',deleteNotification);


router.use('',(req,res,next) =>{
  res.render('page/404')
  next();
})