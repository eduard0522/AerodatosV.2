import { getConnection, releaseConnection } from "../db/index.js";
import { ifExistBox,ifExistHall,ifExistSerie,ifExistShelf,ifExisType} from "./validationExpedient.js";

export async function newExpedientXlsx(dataExpedient) {
  const  {nombre,numero,tipo,estado,numero_serie,nombre_serie,caja,estante,pasillo} = dataExpedient;
  try {
    const conn = await getConnection();
    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE numero_expediente = ?',[numero]);
        if( !ifExistExpedient || ifExistExpedient.error){
          if(conn) releaseConnection(conn)
          console.log(ifExistExpedient)
          return null;
        }
        if(ifExistExpedient[0].length > 0){
          if(conn) releaseConnection(conn)
          return null;
        }
        // Valida si existe la serie, si no existe la crea y regresa el id
         const newSerie = await  ifExistSerie(nombre_serie,numero_serie);
          if(!newSerie){
            return null
          }
            // Valida si existe la caja, si no existe la crea y regresa el id
          const newBox = await ifExistBox(caja);
          if(!newBox){
            return null
          }
         // Valida si existe el tipo, si no existe la crea y regresa el id
          const newType = await ifExisType(tipo);
          if(!newType){
            return null
          } 
            // Valida si existe el estante, si no existe la crea y regresa el id
          const newShlef = await ifExistShelf(estante);
          if(!newShlef){
            return null
          }
            // Valida si existe el pasillo, si no existe la crea y regresa el id
          const newHall = await ifExistHall(pasillo);
          if(!newHall){
            return null
          }
          const newExpedient = await  conn.query('INSERT INTO expedientes(nombre_expediente, numero_expediente, tipo_expediente,estado_organizativo,serie_documental,caja,estante,pasillo) VALUES (?,?,?,?,?,?,?,?)',
          [nombre,numero,newType,estado,newSerie,newBox,newShlef,newHall]);

          if(!newExpedient) return null
        
        if(conn) releaseConnection(conn)
      return true
 } catch (error) {
    console.log(error);
    return null
  }
}
