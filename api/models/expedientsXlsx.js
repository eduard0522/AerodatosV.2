import { getConnection, releaseConnection } from "../db/index.js";
import { ifExistHall , ifExistSerie} from "./validationExpedient.js";

export async function newExpedientXlsx(dataExpedient) {
  const  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;
  let conn;
  try {
     conn = await getConnection();
    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE numero_expediente = $1',[numero]);
        if( !ifExistExpedient || ifExistExpedient.error) return null;
        
        if(ifExistExpedient.rows.length > 0)  return null;
    
          // Valida si existe la serie, si no existe la crea y regresa el id
        const newSerie = await ifExistSerie(nombre_serie);
        if(!newSerie || newSerie.error) return {error:'Error en la creacion de la serie'}
            // Valida si existe el pasillo, si no existe la crea y regresa el id
        const newHall = await ifExistHall(pasillo);
        if(!newHall || newHall.error) return {error: 'Error en la creación de pasillo.'} 

        const newExpedient = await  conn.query('INSERT INTO expedientes(nombre_expediente, numero_expediente,estado_organizativo,serie_documental,caja,estante,pasillo) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [nombre,numero,estado,newSerie,caja,estante,newHall]);

        if(!newExpedient) return null
        
       return true
 } catch (error) {
    console.log(error);
    return null
  }finally{
    if(conn)releaseConnection(conn);
  }
}
