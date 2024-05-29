import xlsx from "xlsx-populate";
import { join, resolve } from 'path';
import { validateExpedient } from "../schemas/expedients.js";
import { newExpedientXlsx } from "../models/expedientsXlsx.js";
import fs from 'fs';


// Controlador para manejar la carga y lectura del archivo
export async function saveFile(file) {
  try {
    const pathFile = join(resolve(), 'public/assets/plantilla', 'datos.xlsx');
    await new Promise((resolve, reject) => {
      file.mv(pathFile, function(err) {
        if (err) {
          console.error('Error al mover el archivo:', err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
    return true;
  } catch (error) {
    console.log('Error en readFileController:', error);
    return null;
  }
}

// Controlador para leer y procesar el archivo Excel
export async function readFileController(req, res) {
  //verifica que venga el archivo
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ message: 'No se encontró ningún archivo' });

  //verifica el tipo de archivo
  const file = req.files.excelFile;
  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

  if (!validTypes.includes(file.mimetype)) return res.status(400).json({ message: 'Tipo de archivo no permitido.' });
  const data = [];
  
  try {
    //LEE EL ARCHIVO 
    const workbook = await xlsx.fromDataAsync(file.data);

    const values = workbook.sheet('datos').usedRange('').value();

    //Genera un objeto con los valores del archivo y los agrega al arreglo data 
    for (let valor of values) {
      if (!valor[0] || !valor[1] || !valor[2]) continue;

      data.push({
        "nombre": valor[1].toString(),
        "numero": valor[0].toString(),
        "estado": valor[6] === 0 ? false : true,
        "nombre_serie": valor[2].toString(),
        "caja": valor[5],
        "estante": parseInt(valor[4]),
        "pasillo": valor[3].toString()
      });
    }
    //Elimina el primer objeto del arreglo, ya que es la cabecera del archivo
    data.shift();

    // Envia los datos a la funcion que envia la solicitud a la base de datos
    const result = await newExpedientXlsxController(data);
    if (!result || result.error) {
      return res.status(500).json({ message: result.error ? result.error :  'Error al procesar los datos' });
    }
    return res.status(200).json({ message: 'OK', result });
  } catch (error) {
    console.log('Error en readFile:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
// Controlador para insertar los datos en la base de datos

async function newExpedientXlsxController(data) {
  // guarda los expedientes que no se guarden por cualquier error devuelto
  const faileds = [];
  // guarda los archivos que se insertan
  let totalInsertados = 0;
  try {
    // rrecorre el arreglo generado y  Valida los datos con el esquema.
    for (let expedient of data) {
      const validate = validateExpedient(expedient);
      if (validate.error) {
        console.log('Error de validación:', validate.error);
        //si la consulta genera un error agrega ese expediente al arreglos de fallidos
        faileds.push(expedient.numero);
      } else {
        // si no genera error se inserta en la base de datos
        const newExpedient = await newExpedientXlsx(expedient);
        if (!newExpedient || newExpedient.error) {
          faileds.push(expedient.numero);
        } else {
          //Si la consulta es correcta incrementa el contador de correctas.
          totalInsertados += 1;
        }
      }
    }
    
    return { faileds, totalInsertados };
  } catch (error) {
    console.log('Error en newExpedientXlsxController:', error);
    return null;
  }
}


