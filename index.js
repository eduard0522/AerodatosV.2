import express from 'express'
/* import morgan from 'morgan'; */
import { router } from './api/src/app/router/router.js';
import {resolve} from 'path';
import { port } from './api/src/config.js';
import fileUpload from 'express-fileupload';
export const app = express();
const statics = resolve('./public');

const PORT = port  || 3100

app.set("views", "./public/view");
app.set("view engine" , "pug");

app.use(fileUpload());

app.use(express.json())
/* app.use(morgan("dev")); */
app.use(express.static(statics));

app.use('/',router)

  app.listen(PORT, ()=>{
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>    Servidor corriendo por el puerto ${ PORT }  <<<<<<<<<<<<<<<<<<<<<<<<`);
}); 

export default app
