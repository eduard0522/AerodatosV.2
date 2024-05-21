import { getConnection, releaseConnection } from "../db/index.js";
import {  newHallService,newSerieService } from "./expedientsModel.js";


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

export async function ifExistSerie(serie) {
  let serieId;
  try {
    const conn = await getConnection()
    const [result] = await conn.query('SELECT * FROM  serie_documental WHERE nombre_serie = ?',[serie]);
    if(!result || result.error){
      releaseConnection(conn)
    return null;
    }
    if(result.length > 0){
      serieId = result[0]
      releaseConnection(conn)
      return serieId.id_serie
    } else{
     const newSerie = await newSerieService(serie);
        serieId = newSerie.insertId
      releaseConnection(conn)
      return serieId
    }
  } catch (error) {
    console.log(error)
    return null
  }
}



