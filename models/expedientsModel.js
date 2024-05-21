import { getConnection,releaseConnection } from "../db/index.js";
import {  ifExistHall, ifExistSerie } from "./validationExpedient.js";
/*********************** EXPEDIENTES  ***********************/

// TRAE TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 

export async function getExpedientsService(limit,offset){
  try {
    const conn =  await getConnection()
    const [expedients] = await conn.query('SELECT  * FROM expedientes_vista limit ? offset ?',[+limit, +offset]);
    const [totalExpedients] = await conn.query('SELECT COUNT(*) AS total FROM expedientes_vista ');

    if(expedients && !expedients.error ){
      releaseConnection(conn)
      return {expedients,  totalExpedients}
     }
     return null
  } catch (error) {
      console.log(error)
      return null
  }
}

// TRAE LOS EXPEDIENTES POR NUMERO O NOMBRE  DE EXPEDIENTE DESDE LA BASE DE DATOS 

export async function getExpedientByExpedientService(expedient,name){
  try {
    if(!name && expedient){
        const conn =  await getConnection()
        const [getExpedient] = await conn.query('SELECT  * FROM expedientes_vista where numero_expediente LIKE ?',[`%${expedient}%`]);
        if(getExpedient && !getExpedient.error ){
          releaseConnection(conn)
          return getExpedient
        }
    }


    if(name && !expedient){
      const conn =  await getConnection()
      const [getExpedient] = await conn.query('SELECT  * FROM expedientes_vista where nombre_expediente LIKE  ? ',[ `%${name}%`]);
      if(getExpedient && !getExpedient.error ){
        releaseConnection(conn)
        return getExpedient
      }
    }

    if(name && expedient){
      const conn =  await getConnection()
      const [getExpedient] = await conn.query('SELECT  * FROM expedientes_vista where nombre_expediente  LIKE ?  and  numero_expediente LIKE ?',[`%${name}%`,`%${expedient}%`]);

      if(getExpedient && !getExpedient.error ){
        releaseConnection(conn)
        return getExpedient
      }
    }
     return null
  } catch (error) {
      console.log(error)
      return null
  }
}

// CUENTA TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 

export async function countExpedientsService(){
  try {
    const conn =  await getConnection()
    const [expedients,organized,unorganized] = await Promise.all([
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes'),
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes WHERE estado_organizativo = 1'),
      conn.query('SELECT  COUNT(*)  AS total FROM expedientes WHERE estado_organizativo = 0')
    ])
    const expedientes = {
      total:expedients[0],
      organizados:organized[0],
      sinOrganizar : unorganized[0]
    }
    if(expedients && !expedients.error ){
      releaseConnection(conn)
      return  expedientes
     }
     return null
  } catch (error) {
      console.log(error)
      return null
  }
}

// CREAR UN NUEVO EXPEDIENTE

export async function newExpedientService(dataExpedient) {
  
  const  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;
  try {
    const conn = await getConnection();
    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE numero_expediente = ?',[numero]);
        if( !ifExistExpedient || ifExistExpedient.error){
          if(conn) releaseConnection(conn)
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
    console.log(error)
    return null
  }

}

// EDITAR UN EXPEDIENTE

export async function updateExpedientService(id,dataExpedient) {
  
  const  {nombre,numero,estado,nombre_serie,caja,estante,pasillo} = dataExpedient;
  try {
    const conn = await getConnection();
    const ifExistExpedient = await conn.query(' SELECT * FROM expedientes WHERE id_expediente = ?',[id]);
        if( !ifExistExpedient || ifExistExpedient.error){
          if(conn) releaseConnection(conn)
          return null;
        }
        if(ifExistExpedient[0].length <= 0){
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

          // AL VALIDAR Y OBTENER TODOS LOS DATOS, ENVIA LA QUERY PARA ACTUALIZAR
          const newExpedient = await  conn.query('UPDATE expedientes SET nombre_expediente = ?, numero_expediente = ?,estado_organizativo = ?,serie_documental = ?,caja = ? ,estante = ?,pasillo = ? WHERE id_expediente = ?',
          [nombre,numero,estado,newSerie,caja,estante,newHall,id]);

          if(!newExpedient) return null
        
        if(conn) releaseConnection(conn)
        return true
      
 } catch (error) {
    console.log(error)
    return null
  }

}

/********************* ELIMINAR EXPEDIENTE  **********************/

export async function deleteExpedientService(id) {
  try {
    const conn =  await getConnection()
    const [result] = await conn.query('DELETE FROM expedientes WHERE id_expediente = ?',[id]);
    if(!result) return null; 
      releaseConnection(conn)
      return true;
    } catch (error) {
      console.log(error)
      return null
  }  
}

/***************************** PASILLOS  ****************************/

// CREAR PASILLOS 

export async function newHallService(pasillo) {
  if(!pasillo){
   console.log("No se ha recibido el numero Pasillo")
   return null
  }
  try {
   const conn =  await getConnection()
   const result = await conn.query('INSERT INTO pasillos (numero_pasillo) VALUES (?)', [pasillo]);
   if(result && !result.error ){
     releaseConnection(conn)  
     return result[0]   
    }
    return null
 } catch (error) {
     console.log(error)
     return null
 }
}
// ELIMINAR PASILLO

export async function deleteHallService(pasillo) {
  if(!pasillo){
    console.log("No se ha recibido el numero de pasillo")
    return null
  }
  try {
    const conn =  await getConnection()
    const deletePasillo = await conn.query('DELETE from pasillos WHERE id_pasillo = ?' ,[pasillo]);
    if(deletePasillo){
    releaseConnection(conn)
      return true
    }
    return null
  } catch (error) {
      console.log(error)
      return null
  }
}

/***************************** SERIES  ****************************/

// CREAR SERIE

export async function newSerieService(serie) {
  if(!serie){
   console.log("No se ha recibido el nombre de serie")
   return null
  }
  try {
   const conn =  await getConnection()
   const [result] = await conn.query('INSERT INTO serie_documental (nombre_serie) VALUES (?)', [serie]);
   if(result ){
     releaseConnection(conn)  
     return result 
    }

    return null
 } catch (error) {
     console.log(error)
     return null
 }
}

// ELIMINAR SERIE

export async function deleteSerieService(serie) {
  if(!serie){
    console.log("No se ha recibido la serie")
    return null
  }
  try {
    const conn =  await getConnection()
    const deleteSerie = await conn.query('DELETE from serie_docuemntal WHERE nombre_serie = ?' ,[serie]);
    if(deleteSerie){
    releaseConnection(conn)
      return true
    }
    return null
  } catch (error) {
      console.log(error)
      return null
  }
}

