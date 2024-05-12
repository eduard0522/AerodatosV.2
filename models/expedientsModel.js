import { getConnection,releaseConnection } from "../db/index.js";
import {  ifExistBox, ifExistHall, ifExistSerie, ifExistShelf } from "./validationExpedient.js";

/*********************** EXPEDIENTES  ***********************/

// TRAE TODOS LOS EXPEDIENTES DE LA BASE DE DATOS 

export async function getExpedientsService(){
  try {
    const conn =  await getConnection()
    const expedients = await conn.query('SELECT  * FROM expedientes_vista');

    if(expedients && !expedients.error ){
      releaseConnection(conn)
      return expedients[0]   
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
         /*    // Valida si existe el tipo, si no existe la crea y regresa el id
          const newType = await ifExisType(tipo);
          if(!newType){
            return null
          } */
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
          [nombre,numero,tipo,estado,newSerie,newBox,newShlef,newHall]);

          if(!newExpedient) return null
        
        if(conn) releaseConnection(conn)
        return true
      
 } catch (error) {
    if(conn) releaseConnection(conn)
    console.log(error)
    return null
  }

}




// EDITAR UN EXPEDIENTE

export async function updateExpedientService(dataExpedient) {
  
  const  {id,nombre,numero,tipo,estado,numero_serie,nombre_serie,caja,estante,pasillo} = dataExpedient;
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
         const newSerie = await  ifExistSerie(nombre_serie,numero_serie);
          if(!newSerie){
            return null
          }
            // Valida si existe la caja, si no existe la crea y regresa el id
          const newBox = await ifExistBox(caja);
          if(!newBox){
            return null
          }
         /*    // Valida si existe el tipo, si no existe la crea y regresa el id
          const newType = await ifExisType(tipo);
          if(!newType){
            return null
          } */
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
          // AL VALIDAR Y OBTENER TODOS LOS DATOS, ENVIA LA QUERY PARA ACTUALIZAR
          const newExpedient = await  conn.query('UPDATE expedientes SET nombre_expediente = ?, numero_expediente = ?, tipo_expediente = ?,estado_organizativo = ?,serie_documental = ?,caja = ? ,estante = ?,pasillo = ? WHERE id_expediente = ?',
          [nombre,numero,tipo,estado,newSerie,newBox,newShlef,newHall,id]);

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

/***************************** SERIES ****************************/

// CREAR SERIES

export async function newSerieService(numero_serie,nombre_serie) {
  if(!(numero_serie && nombre_serie)){
   console.log("No se ha recibido los datos de la serie")
   return null
  }
  try {
   const conn =  await getConnection()
   // VALIDAR SI LA SERIE YA EXISTE
   const [ifExist] = await conn.query('SELECT * FROM serie_documental WHERE numero_serie = ?' ,[numero_serie]);
   if(ifExist.length > 0){
     //SI YA EXISTE, RETORNA TRUE
     return ifExist
   }
   // SI NO EXISTE LA SERIE ENVIA LA INFORMACION PARA INSEERTARLA
   const result = await conn.query('INSERT INTO serie_documental (numero_serie, nombre_serie) VALUES (?,?)', [numero_serie, nombre_serie]);
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

// ELIMINAR SERIE

export async function deleteSerieService(serie) {
    if(!serie){
      console.log("No se ha recibido el numero de serie a eliminar")
      return null
    }
    try {
        const conn =  await getConnection()
        const deleteSerie = await conn.query('DELETE from serie_documental WHERE id_serie = ?' ,[serie]);
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

/***************************** TIPOS DE DOCUMENTO ****************************/

// CREAR TIPOS

export async function newTypeService(nombre_tipo) {
  if(!( nombre_tipo)){
   console.log("No se ha recibido los datos del tipo a eliminar")
   return null
  }
  try {
   const conn =  await getConnection()
   // VALIDAR SI EL TIPO YA EXISTE
   const [ifExist] = await conn.query('SELECT * FROM tipo_documento WHERE id_tipo = ?' ,[nombre_tipo]);
   if(ifExist.length > 0){
     //SI YA EXISTE, RETORNA TRUE
     return true
   }
   // SI NO EXISTE EL TIPO  ENVIA LA INFORMACION PARA INSERTARLO
   const result = await conn.query('INSERT INTO tipo_documento ( nombre_tipo) VALUES (?)', [nombre_tipo]);
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

// ELIMINAR TIPO

export async function deleteTypeService(tipo) {
    if(!tipo){
      console.log("No se ha recibido el id del tipo a eliminar")
      return null
    }
    try {
        const conn =  await getConnection()
        const deleteType = await conn.query('DELETE from tipo_documento WHERE id_tipo = ?' ,[tipo]);
        if(deleteType){
        releaseConnection(conn)
          return true
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}

/*************************** CAJAS  **************************/

// CREAR CAJAS 

export async function newBoxService(caja) {
   if(!caja){
    console.log("No se ha recibido caja")
    return null
   }
   try {
    const conn =  await getConnection()
    // VALIDAR SI LA CAJA YA EXISTE
    const [ifExist] = await conn.query('SELECT * FROM cajas WHERE numero_caja = ?' ,[caja]);
    if(ifExist.length > 0){
      //SI YA EXISTE, RETORNA TRUE
      return true
    }
    // SI NO EXISTE LA CAJA ENVIA LA INFORMACION PARA INSEERTARLA
    const result = await conn.query('INSERT INTO cajas (numero_caja) VALUES (?)', [caja]);
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

// ELIMINAR CAJAS

export async function deleteBoxService(caja) {
  if(!caja){
   console.log("No se ha recibido caja")
   return null
  }
  try {
   const conn =  await getConnection()
   const deleteBox = await conn.query('DELETE from cajas WHERE numero_caja = ?' ,[caja]);
   if(deleteBox){
    releaseConnection(conn)
     return true
   }
    return null
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
   // VALIDAR SI EL PASILLO EXISTE
   const [ifExist] = await conn.query('SELECT * FROM pasillos WHERE numero_pasillo = ?' ,[pasillo]);
   if(ifExist.length > 0){
     //SI YA EXISTE, RETORNA TRUE
     return true
   }
   // SI NO EXISTE EL PASILLO  ENVIA LA INFORMACION PARA INSEERTARLA
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

/***************************** ESTANTES  ****************************/

// CREAR ESTANTES

export async function newShelfService(estante) {
  if(!estante){
   console.log("No se ha recibido el numero Estante")
   return null
  }
  try {
   const conn =  await getConnection()
   // VALIDAR SI EL PASILLO EXISTE
   const [ifExist] = await conn.query('SELECT * FROM estantes WHERE numero_estante = ?' ,[estante]);
   if(ifExist.length > 0){
     //SI YA EXISTE, RETORNA TRUE
     return true
   }

   // SI NO EXISTE EL PASILLO  ENVIA LA INFORMACION PARA INSEERTARLA
   const result = await conn.query('INSERT INTO estantes (numero_estante) VALUES (?)', [estante]);
   if(result ){
     releaseConnection(conn)  
     return true   
    }

    return null
 } catch (error) {
     console.log(error)
     return null
 }
}

// ELIMINAR ESTANTE

export async function deleteShelfService(estante) {
  if(!estante){
    console.log("No se ha recibido el numero de estante")
    return null
  }
  try {
    const conn =  await getConnection()
    const deleteShelf = await conn.query('DELETE from estantes WHERE numero_estante = ?' ,[estante]);
    if(deleteShelf){
    releaseConnection(conn)
      return true
    }
    return null
  } catch (error) {
      console.log(error)
      return null
  }
}

