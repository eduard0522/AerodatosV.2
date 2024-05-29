import { getConnection, releaseConnection,closePool } from "../db/index.js"


// OBTIENE TODOS LOS USUARIOS DE LA BASE DE DATOS

export async function getUsersService() {
  let conn;
  try {
       conn = await getConnection();
      const getUsers = await conn.query(' SELECT  nombre_usuario , correo,id_usuario,rol FROM usuarios');
      if(!getUsers){
        return {error: 'No se logró obtener los datos de los ususarios.'}
      } 

      return getUsers.rows;

  }catch (error) {
      console.log(error)
      return {error:'Ocurrió un error inesperado en el servidor, intente de nuevo mas tarde.'}
  }finally{
    if (conn) releaseConnection(conn)
  }
}

// CREA UN NUEVO USUARIO

export async function createUserService(data) {
  
    if(!data) return null
    const {uuid,name,email,passHash,rol} = data;
    let  conn;

    try {
       conn = await getConnection();

        const ifExistUser = await conn.query('SELECT * FROM usuarios WHERE  correo = $1',[email]);
        if(ifExistUser.rows.length > 0 ){
          return {error: 'Al parecer este usuario ya existe.'}
        } 

        const newUser = await conn.query('INSERT INTO usuarios (id_usuario,nombre_usuario,correo,clave,rol) VALUES ($1,$2,$3,$4,$5)',
        [uuid,name,email,passHash,rol]);
        if(!newUser){
          return {error: 'Ocurrió un error al insertar los datos, intente de nuevo mas tarde.'}
        } 
        return newUser;
    } catch (error) {
        console.log(error)
        return {error:'Ocurrió un error inesperado en el servidor, intente de nuevo mas tarde.'}
    }finally{
      if(conn)  releaseConnection(conn)
    }
}

// ACTUALIZAR USUARIOS

export async function updateUserService(id,data) {
  
  if(!data) return null
  const {name,email,passHash,rol} = data;
  let conn;
  try {
    let conn = await getConnection();

      const validateUser = await conn.query(' SELECT * FROM usuarios WHERE id_usuario = $1',[id]);
  
      if(validateUser.rows.length  === 0 ) return {error:'Este usuario no existe.'}
      
      const updateUser = await conn.query('UPDATE usuarios   SET nombre_usuario = $1, correo = $2,clave = $3,rol = $4 WHERE  id_usuario = $5',
      [name,email,passHash,rol,id]);


      if(!updateUser  || updateUser.rowCount == 0)  return {error:'No se logró actualizar los datos del usuario, intente de nuevo.'}

      return updateUser;
      
  } catch (error) {
      console.log(error)
      return {error:'Ocurrió un error inesperado en el servidor, intente de nuevo mas tarde.'}
  }finally{
    if(conn)  releaseConnection(conn)
  }
}

// ELIMINAR USUARIO

export async function deleteUsersService(id) {
   if(!id) return null
   let conn ;

  try {
    let conn = await getConnection();
    /************ VALIDA SI EL USUARIO QUE SE INTENTA ELIMINAR ES UN ADMINISTRADOR, SI ES ADMINISTRADOR VALIDA QUE EXISTAN MAS ADMINISTRADORES ANTES DE ELIMANAR EL MISMO. */
      const validateUser = await conn.query(' SELECT * FROM usuarios WHERE id_usuario = $1',[id]);

      if(validateUser.rows.length === 0)   return {error:'Este usuario no existe.'}

      if( validateUser.rows[0].rol.toLowerCase() ===  'administrador'){

        const getUsers = await conn.query("SELECT * FROM usuarios WHERE rol LIKE '%administrador%'");
        if(getUsers.rows.length <= 1)   return {error:'No puedes eliminar este usuario, perderias el acceso de administrador.'}
      }
      /******* SI NO ES ADMINISTRADOR O HAY MAS ADMINISTRADORES PROCEDE A ELIMINAR EL USUARIO */
      const deleteUser = await conn.query(' DELETE FROM usuarios WHERE id_usuario = $1',[id]);
      if(!deleteUser || deleteUser.rowCount == 0)   return {error:'No se logró eliminar este usuario, intente de nuevo mas tarde.'}
      
      return deleteUser;

  }catch (error) {
      console.log(error)
      return {error:'Ocurrió un error inesperado en el servidor, intente de nuevo mas tarde.'}
  }finally{
    if (conn) releaseConnection(conn);
  }
}