import { config } from "dotenv";

 config()

  export const host = process.env.DB_HOST;
  export const portdb =  process.env.DB_PORT;
  export const database =  process.env.DATABASE;
  export const user =  process.env.DB_USER;
  export const password =  process.env.DB_PASSWORD ;
  export const port = process.env.PORT;
  export const secret_pass = process.env.SECRET_PASS;
  export const path = process.env.rute;
 
console.log(port)

