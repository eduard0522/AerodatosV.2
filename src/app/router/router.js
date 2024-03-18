import {Router} from 'express';
import {resolve,join,extname} from 'path';
import { createExpedient, editExpedient, getExpedients, getExpedientsUser,deleteExpedient,getExpedientsUserE,getExpedientById } from '../../../controllers/expedients-controllers.js';
import { getRequest, updateRequest,getNotifications, createNotification, createSolicitud,deleteNotification, deleteRequest } from '../../../controllers/request-controller.js';
import { validateUser} from '../../../controllers/login.js';
import { validarTokenUser, validateTokens } from '../../../middleware/validateToken.js';
import { error } from 'console';



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



router.post('/updateBanner', async (req,res) =>{
  try {
    const { banner }=  req.files

    console.log(banner.name)
      if(!banner){
        return res.json({status:400,message:' no viene ningun archivo'})
      }
    /* console.log(req.files) */
    const ext = extname(banner.name);
  
    const ext_permitidas = ['.webp','.png','.jpg','.jepg']
  
    if(!ext_permitidas.includes(ext)){
      return res.status(400).json({message:`Solo se permiten archivos Excel  tu formato es : ${extname(banner.name)}`})
    }
  
    const ruta = join(resolve(),'./src/public/assets/banner','banner.webp');

    banner.mv(ruta , (error) =>{
      if(error){
        console.log(error)
        return res.status(400).json({message:"ocurrio un error"})
      }else{
        console.log(ruta)
       return res.send('ok') 
      }
    })

  } catch (error) {
    console.log(error)
    return error
    
  }
  })

router.get('/download', (req,res) =>{
  const ruta = join(resolve(),'./src/public/assets/plantilla','pruebasExcel.xlsx');
  res.download(ruta, function (error) {
    console.log("Error : ", error)
});
})


router.get('/403',(req,res)=>{
  return res.render('page/403')
});

router.use('',(req,res,) =>{
  return res.render('page/404')
})



