import { getConnection, releaseConnection } from "../db/index.js";
import { ifExistHall , ifExistSerie} from "./validationExpedient.js";

export async function newExpedientXlsx(dataExpedient) {
  const  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;
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
        const newSerie = await ifExistSerie(nombre_serie);
        if(!newSerie){
            return null
          }
    
            // Valida si existe el pasillo, si no existe la crea y regresa el id
        const newHall = await ifExistHall(pasillo);
        if(!newHall){
            return null
          }

          const newExpedient = await  conn.query('INSERT INTO expedientes(nombre_expediente, numero_expediente,estado_organizativo,serie_documental,caja,estante,pasillo) VALUES (?,?,?,?,?,?,?)',
          [nombre,numero,estado,newSerie,caja,estante,newHall]);

          if(!newExpedient) return null
        
        if(conn) releaseConnection(conn)
      return true
 } catch (error) {
    console.log(error);
    return null
  }
}
