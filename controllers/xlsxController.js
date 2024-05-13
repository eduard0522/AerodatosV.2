import  xlsx  from "xlsx-populate";
import {join,resolve} from 'path'
import { validateExpedient } from "../schemas/expedients.js";
import { newExpedientXlsx } from "../models/expedientsXlsx.js";
import fs from 'fs'

const fileRuta =  join(resolve(), './src/public/assets/plantilla','datos.xlsx')
console.log(fileRuta)

export async function readFileController(req,res) {

  console.log(fileRuta , '********************************************************************')
    if(!req.files || Object.keys(req.files).length === 0){
      return res.status(404).json({message:"No se envio ningun archivo."})
  }
  try {
      let file = req.files.excelFile
      let pathFile = join(resolve(), './src/public/assets/plantilla','datos.xlsx');
    
      file.mv(pathFile, function(err) {
        if (err) return res.status(500).send('Error en la carga del archivo, intenta de nuevo.')
      })
     const result =   await readFile()

     if(!result){
      return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde'})
     }

     res.status(200).json({message:'OK' , data:result})

  } catch (error) {
    console.log(error)
  return res.status(500).json({message:'Ocurrio un error inesperado, intente de nuevo mas tarde'})
}
}


export async function readFile() {

  // SE DECLARA UN ARREGLO PARA INSERTAR LOS DATOS DEL ARCHIVO
  let data = []

  try {
    const workbook =  await xlsx.fromFileAsync(fileRuta);
    const value = workbook.sheet('datos').usedRange('').value();

  for(let valor of value){
    // VALIA SI LA FILA VIENE VACIA, SI ES ASI LA IGNORA Y CONTINUA
    if((valor[0] && valor[1] && valor[2])  === undefined ) continue
     //  SI LA FILA  NO VIENE VACIA, INSERTA LOS DATOS A UN ARRAY DE OBJETOS
   data.push({
      "nombre" : valor[1],
      "numero":valor[0].toString(),
      "tipo":valor[7].toLowerCase(),
      "estado": valor[8] === 0 ? false : true,
      "numero_serie":valor[2],
      "nombre_serie":valor[3],
      "caja": valor[6],
      "estante":valor[5],
      "pasillo":valor[4].toString()
    })
  }
  // ELIMINAMOS EL PRIMER ELEMENTO DEL ARREGLO, QUE SERIA EL EMCABEZADO DE LA TABLA 
  data.shift();
  const result =  await newExpedientXlsxController(data)
  console.log(result)
  if(!result){
    return null
  }

  return result
  } catch (error) {
    console.log(error)
    return null
  }
  
}


// RECIBE LOS DATOS, VALIDA CON EL ESQUEMA Y ENVIA LA SOLICITUD AL MODELO PARA LA REALIZAR LA QUERY

async function  newExpedientXlsxController(data) {
    // SE DECLARA UN ARREGLO VACIO PARA INSERTAR LOS EXPEDIENTES QUE N0 SE INSERTARON
    let faileds = [];
    // SE DECLARA UNA VARIABLE  PARA CONTABILIZAR  LOS EXPEDIENTES QUE SE INSERTARON
    let totalInsertados = 0;
  try {
    // SE RECORRE EL ARREGLO DATA PARA ENVIAR LOS DATOS E INSERTAR EL EXPEDIENTE
    for (let expedient of data){
      // SE ENVIAN LOS DATOS AL ESQUMA DE VALIDACIÓN DE TIPOS DE DATOS.
        const validate = validateExpedient(expedient)
        if(validate.error){
      // SI HAY ALGUN ERROR SE INSERTA EL NUMERO DEL EXPEDIENTE AL ARREGLOS DE FALLIDOS
        console.log(validate.error)
        faileds.push(expedient.numero)
      }else{
      // SE ENVIA LA SOLICITUD AL MODELO PARA QUE ENVIE LA QUERY.
      let newExpedient = await newExpedientXlsx(expedient)
      // SI SUCEDE ALGUN ERROR, SE EL NUMERO DE EXPIENTE AL ARREGLO DE FALLIDOS
        if(!newExpedient || newExpedient.error){
          faileds.push(expedient.numero)
        }else{
       // SI NO HAY ERRORES, SE INCREMENTA EL CONTADOR DE EXPEDIENTES INSERTADOS
          totalInsertados += 1
        }
      }
    }

    deleteFile()
    return {faileds,totalInsertados}
  } catch (error) {
    console.log(error)
    return null
  }
}


// Utiliza fs.unlink para eliminar el archivo
function deleteFile() {
  fs.unlink(fileRuta, (err) => {
    if (err) {
        console.error('Error al eliminar el archivo:', err);
        return;
    }
    console.log('Archivo eliminado exitosamente.');
})
}
