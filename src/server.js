import { app } from "./app/router/app.js";

const port =  app.get("port");

app.listen(port, ()=>{
  console.log(`>>>>>>>>>>>>>>>>>>>>>>>    Servidor corriendo por el puerto ${port}  <<<<<<<<<<<<<<<<<<<<<<<<`);
});
