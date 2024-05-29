import express from 'express'
/* import morgan from 'morgan'; */
import { router } from './src/app/router/router.js';
import {resolve} from 'path';
import { port } from './src/config.js';
import fileUpload from 'express-fileupload';
export const app = express();
const statics = resolve('./src/public');

const PORT = port  || 3100

app.set("views", "./src/public/view");
app.set("view engine" , "pug");

app.use(fileUpload());

app.use(express.json())
/* app.use(morgan("dev")); */
app.use(express.static(statics));

app.use(router)


app.listen(PORT, ()=>{
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>    Servidor corriendo por el puerto ${ PORT }  <<<<<<<<<<<<<<<<<<<<<<<<`);
});
 

