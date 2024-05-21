import { getConnection,releaseConnection } from "../db/index.js";
import {  ifExistBox, ifExistHall, ifExistShelf } from "./validationExpedient.js";

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
          console.log(ifExistExpedient)
          return null;
        }
        if(ifExistExpedient[0].length > 0){
          if(conn) releaseConnection(conn)
          return null;
        }
            // Valida si existe la caja, si no existe la crea y regresa el id
          const newBox = await ifExistBox(caja);
          if(!newBox){
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

          const newExpedient = await  conn.query('INSERT INTO expedientes(nombre_expediente, numero_expediente,estado_organizativo,serie_documental,caja,estante,pasillo) VALUES (?,?,?,?,?,?,?)',
          [nombre,numero,estado,nombre_serie,newBox,newShlef,newHall]);

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
            // Valida si existe la caja, si no existe la crea y regresa el id
          const newBox = await ifExistBox(caja);
          if(!newBox){
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
          // AL VALIDAR Y OBTENER TODOS LOS DATOS, ENVIA LA QUERY PARA ACTUALIZAR
          const newExpedient = await  conn.query('UPDATE expedientes SET nombre_expediente = ?, numero_expediente = ?,estado_organizativo = ?,serie_documental = ?,caja = ? ,estante = ?,pasillo = ? WHERE id_expediente = ?',
          [nombre,numero,estado,nombre_serie,newBox,newShlef,newHall,id]);

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

