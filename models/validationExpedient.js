import { getConnection, releaseConnection } from "../db/index.js";
import { newBoxService, newShelfService, newHallService  } from "./expedientsModel.js";



export async function ifExistBox(caja) {
  let cajaId;
  try {
    const conn = await getConnection()
    const [result] = await conn.query('SELECT * FROM cajas WHERE numero_caja= ?',[caja]);
    if(!result || result.error){
      releaseConnection(conn)
    return null;
    }
    if(result.length > 0){
     cajaId = result[0].numero_caja;
     console.log(cajaId)
     releaseConnection(conn)
     return cajaId
    } else{
     const newBox= await  newBoxService(caja);
      cajaId = caja
      releaseConnection(conn)
      return cajaId 
    }
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function ifExistShelf(estante) {
  let shelfId;
  try {
    const conn = await getConnection()
    const [result] = await conn.query('SELECT * FROM estantes WHERE numero_estante= ?',[estante]);
  
    if(!result || result.error){
      releaseConnection(conn)
    return null;
    }

    if(result.length > 0){
     shelfId = estante
     console.log(shelfId)
     releaseConnection(conn)
     return shelfId
    } else{
     const newShelf = await newShelfService(estante);
     console.log(newShelf)
      shelfId = estante
      releaseConnection(conn)
      return shelfId
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function ifExistHall(pasillo) {
  let pasilloId;
  try {
    const conn = await getConnection()
    const [result] = await conn.query('SELECT * FROM  pasillos WHERE numero_pasillo = ?',[pasillo]);
    if(!result || result.error){
      releaseConnection(conn)
    return null;
    }
    if(result.length > 0){
      pasilloId = result[0]
      releaseConnection(conn)
      return pasilloId.id_pasillo
    } else{
     const newHall = await newHallService(pasillo);
        pasilloId = newHall.insertId
      releaseConnection(conn)
      return pasilloId
    }
  } catch (error) {
    console.log(error)
    return null
  }
}



