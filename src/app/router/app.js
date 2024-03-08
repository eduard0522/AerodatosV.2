import express from 'express'
import morgan from 'morgan';
import { router } from './router.js';
import {resolve} from 'path';
import { port } from '../../config.js';


export const app = express();
const statics = resolve('./src/public');

app.set("port",port|| 3100);
app.set("views", "./src/public/view");
app.set("view engine" , "pug");

app.use(express.json())
app.use(morgan("dev"));
app.use(express.static(statics));
app.use(router)

