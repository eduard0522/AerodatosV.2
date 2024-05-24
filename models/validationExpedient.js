import { getConnection, releaseConnection } from "../db/index.js";
import {  newHallService,newSerieService } from "./expedientsModel.js";


export async function ifExistHall(pasillo) {

  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query('SELECT * FROM  pasillos WHERE numero_pasillo = $1',[pasillo]);

    if(!result || result.error) return null;
    
    if(result.rows.length > 0){
       return result.rows[0].id_pasillo
    } else{
     const newHall = await newHallService(pasillo);
     return newHall
    }

  } catch (error) {
    console.log(error)
    return {error:'Ocurrió un error inesperado al crear el pasillo..'}
  }finally{
    if(conn) releaseConnection(conn);
  }
}


export async function ifExistSerie(serie) {
  let conn;

  try {
    conn = await getConnection()

    const result = await conn.query('SELECT * FROM  serie_documental WHERE nombre_serie = $1',[serie]);
    if(!result || result.error)  return null;
    
    if(result.rows.length > 0){
      return result.rows[0].id_serie
    } else{
      const newSerie = await newSerieService(serie)  
      return newSerie
    }

  } catch (error) {
    console.log(error)
    return {error:'Ocurrió un error inesperado al crear la serie.'}
  }finally{
    if(conn) releaseConnection(conn);
  }
}



