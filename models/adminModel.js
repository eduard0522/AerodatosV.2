import { getConnection, releaseConnection } from "../db/index.js"


// OBTIENE TODOS LOS USUARIOS DE LA BASE DE DATOS

export async function getUsersService() {
  try {
      const conn = await getConnection();
      const [getUsers] = await conn.query(' SELECT  nombre_usuario , correo,id_usuario,rol FROM usuarios');
      if(!getUsers){
        releaseConnection(conn)
        return null
      } 
      releaseConnection(conn)
      return getUsers;

  }catch (error) {
      console.log(error)
      return null
  }
}

// CREA UN NUEVO USUARIO

export async function createUserService(data) {
  
    if(!data) return null
    const {uuid,name,email,passHash,rol} = data;
    try {
        const conn = await getConnection();
        const [ifExistUser] = await conn.query('SELECT * FROM usuarios WHERE  correo = ?',[email]);

        if(ifExistUser.length  > 0 ) return null

        const [newUser] = await conn.query('INSERT INTO usuarios (id_usuario,nombre_usuario,correo,clave,rol) VALUES (?,?,?,?,?)',
        [uuid,name,email,passHash,rol]);

        if(!newUser){
          releaseConnection(conn)
          return null
        } 
        releaseConnection(conn)
        return newUser;
        
    } catch (error) {
        console.log(error)
        return null
    }
}

// ACTUALIZAR USUARIOS

export async function updateUserService(id,data) {
  
  if(!data) return null
  const {name,email,passHash,rol} = data;
  try {
      const conn = await getConnection();
      const [validateUser] = await conn.query(' SELECT * FROM usuarios WHERE id_usuario = ?',[id]);
      console.log(validateUser)

      if(validateUser.length === 0 ){
        releaseConnection(conn)
        return null
      }
      const [updateUser] = await conn.query('UPDATE usuarios   SET nombre_usuario = ?, correo = ?,clave = ?,rol = ? WHERE  id_usuario = ?',
      [name,email,passHash,rol,id]);

      if(!updateUser){
        releaseConnection(conn)
        return null
      } 
      releaseConnection(conn)
      return updateUser;
      
  } catch (error) {
      console.log(error)
      return null
  }
}

// ELIMINAR USUARIO

export async function deleteUsersService(id) {
   if(!id) return null
  try {
      const conn = await getConnection();
    /************ VALIDA SI EL USUARIO QUE SE INTENTA ELIMINAR ES UN ADMINISTRADOR, SI ES ADMINISTRADOR VALIDA QUE EXISTAN MAS ADMINISTRADORES ANTES DE ELIMANAR EL MISMO. */
      const [validateUser] = await conn.query(' SELECT * FROM usuarios WHERE id_usuario = ?',[id]);

      if(validateUser[0].rol.toLowerCase() ===  'administrador'){
        const [getUsers] = await conn.query("SELECT * FROM usuarios WHERE rol LIKE '%administrador%'");
        if(getUsers.length <= 1) return null
      }
      /******* SI NO ES ADMINISTRADOR O HAY MAS ADMINISTRADORES PROCEDE A ELIMINAR EL USUARIO */
      const [deleteUser] = await conn.query(' DELETE FROM usuarios WHERE id_usuario = ?',[id]);
      if(!deleteUser){
        releaseConnection(conn)
        return null
      } 
      releaseConnection(conn)
      return deleteUser;
  }catch (error) {
      console.log(error)
      return null
  }
}