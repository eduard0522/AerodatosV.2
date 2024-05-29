import { getConnection,releaseConnection } from "../db/index.js";
import {  ifExistHall, ifExistSerie } from "./validationExpedient.js";
/*********************** EXPEDIENTES  ***********************/

// TRAE TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 

export async function getExpedientsService(limit,offset){
  let conn;
  try {
    conn =  await getConnection()
    const  expedients = await conn.query('SELECT  * FROM expedientes_vista limit $1 offset $2',[+limit, +offset]);
    const totalExpedients = await conn.query('SELECT COUNT(*) AS total FROM expedientes_vista ');

    if(expedients  && !expedients.error ){

      let data = { expedients : expedients.rows , totalExpedients: totalExpedients.rows[0]}
      return  data
     }
     return {error: 'No se logro obtener la información solicitada'}
  } catch (error) {
      console.log(error)
      return {error: 'Ocurrio un erron inesperado, intente de nuevo mas tarde.'}
  }finally{
    if(conn) releaseConnection(conn)
  }
}


// TRAE LOS EXPEDIENTES POR NUMERO O NOMBRE  DE EXPEDIENTE DESDE LA BASE DE DATOS 

export async function getExpedientByExpedientService(expedient,name){
  let conn ;
  try {
    let lowerName;
    name ? lowerName = name.toLowerCase() : lowerExpedient = null;
    
    if(!name && expedient){
        conn =  await getConnection()
        const getExpedient = await conn.query('SELECT  * FROM expedientes_vista where numero_expediente LIKE $1',[`%${expedient}%`]);
        if(getExpedient && !getExpedient.error )  return getExpedient.rows
    }

    if(name && !expedient){
      const conn =  await getConnection()
      const getExpedient = await conn.query('SELECT  * FROM expedientes_vista where lower(nombre_expediente) LIKE  $1 ',[ `%${lowerName}%`]);
      if(getExpedient && !getExpedient.error ) return getExpedient.rows
  
    }

    if(name && expedient){
      const conn =  await getConnection()
      const getExpedient = await conn.query('SELECT  * FROM expedientes_vista where lower(nombre_expediente)  LIKE $1 and  numero_expediente LIKE $2',[`%${lowerName}%`,`%${expedient}%`]);

      if(getExpedient && !getExpedient.error ) return getExpedient.rows
    }
     return {error: 'Ocurrio un error al obtener la información, intente de nuevo mas tarde.'}
  } catch (error) {
      console.log(error)
      return {error:'Ocurrio un error inesperado, intente de nuevo mas tarde.'}
  }
}
// CUENTA TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 
export async function countExpedientsService(){
  let conn;
  try {
    conn =  await getConnection()

    const [expedients,organized,unorganized] = await Promise.all([
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes'),
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes WHERE estado_organizativo = True'),
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes WHERE estado_organizativo = False')
    ]);
    const expedientes = {
      total:expedients.rows[0],
      organizados:organized.rows[0],
      sinOrganizar : unorganized.rows[0]
    }

    if(expedients && !expedients.error ){
      return  expedientes
     }
     return {error:"Ocurrio un error al obtener la información, intente de nuevo mas tarde."}
  } catch (error) {
      console.log(error)
      return  {error:"Ocurrio un error inesperado, intente de nuevo mas tarde."}
  }finally{
   if(conn) releaseConnection(conn)
  }
}



// CREAR UN NUEVO EXPEDIENTE

export async function newExpedientService(dataExpedient) {
  
  let  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;

  estado == 0 ? estado = false : estado = true
  let conn;
  try {
    conn = await getConnection();

    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE numero_expediente = $1',[numero]);
        if( !ifExistExpedient || ifExistExpedient.error) return {error:'Ocurrio un error al validar expediente, intente de nuevo.'};
  
        if(ifExistExpedient.rows.length > 0) return {error:"Este expediente ya existe."};
    
          // Valida si existe la serie, si no existe la crea y regresa el id
        const newSerie = await ifExistSerie(nombre_serie);
        if(!newSerie || newSerie.error) return {error: newSerie.error ? newSerie.error : 'Ocurrió un error al crear la serie, valida la información e intente de nuevo.'}
        
        // Valida si existe el pasillo, si no existe la crea y regresa el id
        const newHall = await ifExistHall(pasillo);
          if(!newHall || newHall.error) return { error: newHall.error ? newHall.error : 'Ocurrió un error al crear el pasillo, valida la información e intente de nuevo.'}
            
        const newExpedient = await  conn.query('INSERT INTO expedientes(nombre_expediente, numero_expediente,estado_organizativo,serie_documental,caja,estante,pasillo) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [nombre,numero,estado,newSerie,caja,estante,newHall]);


          if(!newExpedient || newExpedient.rowCount === 0) return {error:"Ocurrió un error al crear el expediente valida la información e intenta de nuevo."}
            
      // CREACIÓN EXITOSA
        return true

 } catch (error) {
    console.log(error)
    return {error:"Ocurrió un error inesperado, intenta de nuevo mas tarde."}
  }finally{
    if(conn) releaseConnection(conn)
  }
}

// EDITAR UN EXPEDIENTE
export async function updateExpedientService(id,dataExpedient) {
  
  const  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;
  let conn;
  try {
    conn = await getConnection();
    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE id_expediente = $1',[id]);
        if( !ifExistExpedient || ifExistExpedient.error){
          return {error: 'Ocurrió un error al validar el expediente, intenta de nuevo.'};
        }
        if(ifExistExpedient.rows.length <= 0) return {error: 'Este expediente no existe.'}

          // Valida si existe la serie, si no existe la crea y regresa el id
          const newSerie = await ifExistSerie(nombre_serie);
          if(!newSerie)  return {error:'Error al realizar la actualización del expediente.'}
          
            // Valida si existe el pasillo, si no existe la crea y regresa el id
          const newHall = await ifExistHall(pasillo);
          if(!newHall) return {error:'Error al realizar la actualización del expediente.'}
            
          // AL VALIDAR Y OBTENER TODOS LOS DATOS, ENVIA LA QUERY PARA ACTUALIZAR
          const newExpedient = await  conn.query('UPDATE expedientes SET nombre_expediente = $1, numero_expediente = $2,estado_organizativo = $3,serie_documental = $4,caja = $5 ,estante = $6,pasillo = $7 WHERE id_expediente = $8',
          [nombre,numero,estado,newSerie,caja,estante,newHall,id]);

          if(!newExpedient) return {error:'Error al realizar la actualización del expediente.'}
        
     // ACTUALIZACIÓN EXITOSA
    return true
      
 } catch (error) {
    console.log(error)
    return {error:"Ocurrió un error inesperado, intente de nuevo mas tarde."}
  } finally{
    if(conn) releaseConnection(conn)
  }

}

/********************* ELIMINAR EXPEDIENTE  **********************/

export async function deleteExpedientService(id) {
  let conn;
  try {
    conn =  await getConnection()

    const result = await conn.query('DELETE FROM expedientes WHERE id_expediente = $1 ',[id]);
    if(!result) return {error:'Ocurrió un error al eliminar este expediente.'}; 

      return true;

    } catch (error) {
      console.log(error)
      return {error:"Ocurrió un error inesperado, intente de neuvo mas tarde."}
  } finally{
    if(conn) releaseConnection(conn)
  }
}




/***************************** PASILLOS  ****************************/
// CREAR PASILLOS 
export async function newHallService(pasillo) {
  let conn;
  if(!pasillo){
   console.log("No se ha recibido el numero Pasillo")
   return {error:'No se recibió en número de pasillo,'}
  }
  try {
   conn = await getConnection()
   const result = await conn.query('INSERT INTO pasillos (numero_pasillo) VALUES ($1) RETURNING id_pasillo', [pasillo]);
   if(result && !result.error ) return result.rows[0].id_pasillo
   // SI SUCEDE ALGÚN ERROR

    return null
 } catch (error) {
     console.log(error)
     return {error:"Ocurrio un error al crear el pasillo."}
 }finally{
  if(conn) releaseConnection(conn);
 }
}
// ELIMINAR PASILLO

export async function deleteHallService(pasillo) {
  if(!pasillo){
    console.log("No se ha recibido el numero de pasillo")
    return {error:'No se recibió en número de pasillo.'}
  }
  let conn;
  try {
    conn =  await getConnection()
    const deletePasillo = await conn.query('DELETE from pasillos WHERE id_pasillo = $1' ,[pasillo]);
    if(deletePasillo.rowCount > 0)  return true

    return null
  } catch (error) {
      console.log(error)
      return {error:"Ocurrio un error al eliminar el pasillo."}
  }finally{
    if(conn) releaseConnection(conn);
  }
}

/***************************** SERIES  ****************************/
// CREAR SERIE
export async function newSerieService(serie) {
  if(!serie){
   console.log("No se ha recibido el nombre de serie")
   return {error:'No se recibió el nombre de serie.'}
  }
  try {
   const conn =  await getConnection()
   const result = await conn.query('INSERT INTO serie_documental (nombre_serie) VALUES ($1) RETURNING id_serie', [serie]);
   if(result) return result.rows[0].id_serie
    
    return null
 } catch (error) {
     console.log(error)
     return {error:'Ocurrió un error al crear el pasillo.'}
 }
}
// ELIMINAR SERIE

export async function deleteSerieService(serie) {
  if(!serie){
    console.log("No se ha recibido la serie")
    return {error:'No se recibió el nombre de serie.'}
  }
  let conn;
  try {
    conn =  await getConnection()

    const deleteSerie = await conn.query('DELETE from serie_docuemntal WHERE nombre_serie = $1' ,[serie]);
    if(deleteSerie.rowCount  > 0 )return true
    return null
  } catch (error) {
      console.log(error)
      return {error: "Ocurrió un error al eliminar la serie."}
  }finally{
    if(conn) releaseConnection(conn);
  }
}

