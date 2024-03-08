import { connectionDB } from "../db/index.js"


export async function validateExpedient(data){

  console.log('<<<<<<<<<<<<< Validando si existe >>>>>>>>>>><<<<<')
  try {
  const [ifexist] = await connectionDB.query('SELECT COUNT(*) expedientes FROM expedientes WHERE expediente = ?',[data]);

  if(!ifexist){
    throw{
      status:421,
      message:'¡! Ocurrio un problema, intentelo de nuevo !!'
    }}

  const result = Object.values(ifexist[0])
  if(result[0] === 0){
    return true;
  }

  return false

  } catch (error) {
    return error
  }
}




export async function validateFilds(table,field,data){
  try {
    console.log(`<<<<<<<<<<<<< Validando si existe ${field}>>>>>>>>>>><<<<<`)
  const [ifexist] = await connectionDB.query(`SELECT COUNT(*) ${table} FROM ${table} WHERE ${field} = ?`,[data]);

  
  if(!ifexist){
    throw{
      status:421,
      message:'¡! Ocurrio un problema, intentelo de nuevo !!'
    }}

  const result = Object.values(ifexist[0])
  if(result[0] === 0){
    return false;
  }
 
  return true

  } catch (error) {
    return error
  }
}


export async function createField(table,field,data){
  try {
    console.log(`creando ${table}`)
    const [create] = await connectionDB.query(`INSERT INTO ${table}(${field})  VALUES(${data});`)
    console.log(create , `create ${field}` )
  if(!create){
    throw{
      status:421,
      message:'¡! Ocurrio un problema, intentelo de nuevo !!'
    }
  }
  console.log(`${create}  creado ${field}`)
  return create
  } catch (error) {
    return error
  }
}



export async function createCuerpo(data){
  try {
    console.log(`creando cuerpos`)
    const [create] = await connectionDB.query('INSERT INTO cuerpos(nombre_cuerpo) VALUES (?);',[data] )
    console.log(create , `create cuerpos` )
  if(!create){
    throw{
      status:421,
      message:'¡! Ocurrio un problema, intentelo de nuevo !!'
    }
  }
  console.log(`${create}  creado ${data}`)
  return create
  } catch (error) {
    return error
  }
}


