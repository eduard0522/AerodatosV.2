
import { connectionDB } from "../db/index.js";
import { createCuerpo, createField, validateExpedient, validateFilds } from "./validationExpedient.js";

export const getExpedientsModel = async () => {
  try {
    const [expedients] = await connectionDB.query(
      "SELECT * FROM ubicacion_expediente"
    );
    if (!expedients) {
      throw {
        status: 500,
        message: "¡ ¡No se logro obtener los expedientes, intente mas tarde !!",
      };
    }

    return expedients;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};





export const createExpedientModel = async ({input}) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>< MODELO <<<<<<<<<<<<<<<<<<<<<<")
  let serieId;
  const {
    expediente,referencia,dependencia,serie,subserie,pasillo,cuerpo,estante,entrepanio,caja, carpeta,} = input;

  try {
      const ifexistExpedient = await validateExpedient(expediente);
        if(!ifexistExpedient){
          throw{
            status: 500,
            message: "¡ ¡No se logro obtener los expedientes, intente mas tarde !!"}
        }

      const ifexistSerie = await validateFilds('series','nombre_serie',serie);
        if(!ifexistSerie){
          const createSerie = await  createField('series','nombre_serie',serie);
           
            if(!createSerie){
               throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
              } }

              serieId = createSerie.insertId
      }else{
        const [getIdSerie] = await  connectionDB.query('SELECT id_series FROM series WHERE nombre_serie = ?;',[serie])
        serieId = Object.values(getIdSerie[0])[0]
      }

   
      const ifexistPasillo = await validateFilds('pasillos','numero_pasillo',pasillo);
        if(!ifexistPasillo){
            const createPasillo = await  createField('pasillos','numero_pasillo',pasillo);
            if(!createPasillo){
              throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
              } }
       }


       const ifexistCuerpo = await validateFilds('cuerpos','nombre_cuerpo',cuerpo);
       console.log(cuerpo)
        if(!ifexistCuerpo){
            const createcuerpo = await createCuerpo(cuerpo);
            if(!createcuerpo)
              throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
            } 
          }
        

        const ifexistEstante = await validateFilds('estantes','numero_estante',estante);
            if(!ifexistEstante){
               const createEstante = await  createField('estantes','numero_estante',estante);
                  if(!createEstante){
                    throw{
                      status:500,
                      message: ' Ocurrio un error, intente nuevamente'
                    } }
              }


        const ifexistEntrepanio = await validateFilds('entrepanios','numero_entrepanio',entrepanio);
         if(!ifexistEntrepanio){
            const createEntrepanio = await  createField('entrepanios','numero_entrepanio',entrepanio);
                if(!createEntrepanio){
                    throw{
                      status:500,
                      message: ' Ocurrio un error, intente nuevamente'
                    } }
            }


        const ifexistCaja = await validateFilds('cajas','numero_caja',caja);
         if(!ifexistCaja){
            const createCaja = await  createField('cajas','numero_caja',caja);
              if(!createCaja){
                throw{
                  status:500,
                  message: ' Ocurrio un error, intente nuevamente'
                } }
             }

             console.log( 'Validar para crear expediente')

        const [newExpedient] = await connectionDB.query("INSERT INTO expedientes(expediente,referencia,dependencia,serie,subserie,pasillo,cuerpo,estante,entrepanio,caja,carpeta) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
        [expediente,referencia,dependencia,serieId,subserie,pasillo,cuerpo,estante,entrepanio,caja,carpeta]); 
        
        if(newExpedient.error){
          throw{
            status:500,
            message:'Ocurrio un error en la inserción de los datos, intente nuevamente.'
          }  
        }
        return newExpedient; 

    }catch (error) {
      console.log(error)
    return false;
   }
};



export const  editExpedientModel = async (data,id) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>< MODELO <<<<<<<<<<<<<<<<<<<<<<")
   let serieId; 
  const expediente_id = id;

  const {expediente,referencia,dependencia,serie,subserie,pasillo,cuerpo,estante,entrepanio,caja, carpeta,} = data;
 
  try {

    const [IfExistId] = await connectionDB.query ("SELECT COUNT(*) FROM expedientes WHERE expediente_id = ?", [expediente_id]);

    const resultRequestId = Object.values(IfExistId[0]);

    if(!resultRequestId[0] === 0){
      throw{
        status:404,
        message:'Este Expediente No existe'
      }  
    }

      const ifexistExpedient = await validateExpedient(expediente);
        if(!ifexistExpedient){
          throw{
            status: 500,
            message: "¡ ¡No se logro obtener los expedientes, intente mas tarde !!"}
        }


      const ifexistSerie = await validateFilds('series','nombre_serie',serie);

        if(!ifexistSerie){
          const createSerie = await  createField('series','nombre_serie',serie);
            if(!createSerie){
               throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
              } }
              serieId = createSerie.insertId
      }else{
        const [getIdSerie] = await  connectionDB.query('SELECT id_series FROM series WHERE nombre_serie = ?;',[serie])
        serieId = Object.values(getIdSerie[0])[0]
      }


   
      const ifexistPasillo = await validateFilds('pasillos','numero_pasillo',pasillo);
        if(!ifexistPasillo){
            const createPasillo = await  createField('pasillos','numero_pasillo',pasillo);
            if(!createPasillo){
              throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
              } }
       }


       const ifexistCuerpo = await validateFilds('cuerpos','nombre_cuerpo',cuerpo);
        if(!ifexistCuerpo){
            const createCuerpo = await  createField('cuerpos','nombre_cuerpo',cuerpo);
            if(!createCuerpo)
              throw{
                status:500,
                message: ' Ocurrio un error, intente nuevamente'
            } 
          }
        

        const ifexistEstante = await validateFilds('estantes','numero_estante',estante);
            if(!ifexistEstante){
               const createEstante = await  createField('estantes','numero_estante',estante);
                  if(!createEstante){
                    throw{
                      status:500,
                      message: ' Ocurrio un error, intente nuevamente'
                    } }
              }


        const ifexistEntrepanio = await validateFilds('entrepanios','numero_entrepanio',entrepanio);
         if(!ifexistEntrepanio){
            const createEntrepanio = await  createField('entrepanios','numero_entrepanio',entrepanio);
                if(!createEntrepanio){
                    throw{
                      status:500,
                      message: ' Ocurrio un error, intente nuevamente'
                    } }
            }


        const ifexistCaja = await validateFilds('cajas','numero_caja',caja);
         if(!ifexistCaja){
            const createCaja = await  createField('cajas','numero_caja',caja);
              if(!createCaja){
                throw{
                  status:500,
                  message: ' Ocurrio un error, intente nuevamente'
                } }
             }

             console.log( 'Validar para crear expediente')

        const [editExpedient] = await connectionDB.query("UPDATE expedientes  SET expediente = ?, referencia=? ,dependencia=? ,serie=?,subserie=?,pasillo=?,cuerpo=?,estante=?,entrepanio=?,caja=?,carpeta=? WHERE expediente_id = ?; ",
        [expediente,referencia,dependencia,serieId,subserie,pasillo,cuerpo,estante,entrepanio,caja,carpeta,expediente_id]); 
        
        if(editExpedient.error){
          throw{
            status:500,
            message:'Ocurrio un error en la inserción de los datos, intente nuevamente.'
          }  
        }
        return editExpedient; 

    }catch (error) {
      console.log(error)
    return false;
   }
};





export const deleteExpedientModel = async (id) =>{
  try {
    if(!id){
      throw{
        status:404,
        message:'Este expediente no existe'
      }
    }

    const deleteExpedient = await connectionDB.query('DELETE expedientes FROM expedientes WHERE expediente_id= ? ' ,[id]);
    console.log(deleteExpedient);
    if(!deleteExpedient){
      throw{
        status:500,
        message:'INTERNAL SERVER ERROR'
      }
    }
    return true

  } catch (error) {
    console.log(error)
    return error
  }
}



