
import { agregarToast } from "./toast.js";
import { ClosedModal,openModal } from "./modals.js";


const d = document;
/*********************** CREAR USUARIO ********************/
async function createUser(data) {
  if(!data) return null
  try {
    let res = await axios('/admin', {
      method:'POST',
      data: data
    });
    return true
  } catch (error) {
    return null
  }
}

export async function handleSubmitNewUser(e) {
  try {
      const data = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value,
        rol: e.target.rol.value,
      }
      const newUser =  createUser(data);
      if(newUser){
        agregarToast({
          tipo:'info',
          titulo:'Muy bien',
          descripcion:'Usuario creado correctamente',
          autocierre:true,
        });
        clearDataForm('createUserForm')
        ClosedModal('createUserForm', 'hidden-form')
      }else{
        agregarToast({
          tipo:'warning',
          titulo:'Opps!',
          descripcion:'Algo ah salido mal, intente de nuevamente.',
          autocierre:true,
        });
     }
  } catch (error) {
    agregarToast({
      tipo:'error',
      titulo:'Opps!',
      descripcion:'Algo ah salido mal, intente de nuevamente.',
      autocierre:true,
    });
    return null
  }
}


/************************ EDITAR USUARIO ********************/

async function updateUser(id,data) {
  if(!data) return null
  try {
    let res = await axios(`/admin/${id}`, {
      method:'PATCH',
      data: data
    })
    if(res.status === 200){
      return true
    }
  } catch (error) {
    return null
  }
}

export async function handleSubmitUpdateUser(e) {
  try {
      const data = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value,
        rol: e.target.rol.value,
      }
      const id = e.target.idUser.value
     const update =  updateUser(id,data); 
    if(update){
        agregarToast({
          tipo:'info',
          titulo:'Muy bien',
          descripcion:'Usuario editado correctamente',
          autocierre:true,
        });
        ClosedModal('updateUserForm', 'hidden-form');
        setTimeout(()=>{
          location.reload();
        },4000)
    }else{
        agregarToast({
          tipo:'warning',
          titulo:'Opps!',
          descripcion:'Algo ah salido mal, intente de nuevamente.',
          autocierre:true,
        });
     } 
  } catch (error) {
    agregarToast({
      tipo:'error',
      titulo:'Opps!',
      descripcion:'Algo ah salido mal, intente de nuevamente.',
      autocierre:true,
    });
  }
}

/************** ELIMINAR USUARIO  *******************/

export async function deleteUser(e){

  try {
    const id = e.target.dataset.id
    let deleteUser = await axios(`/admin/${id}`,{
      method:'DELETE',
    });
    console.log(deleteUser)
    if(deleteUser){
      agregarToast({
        tipo:'info',
        titulo:'Muy bien',
        descripcion:'Usuario eliminado correctamente',
        autocierre:true,
      });

      setTimeout(()=>{
        location.reload();
      },4000) 
    }
  } catch (error) {
    agregarToast({
      tipo:'error',
      titulo:'Opps!',
      descripcion:'Algo ah salido mal, intente de nuevamente.',
      autocierre:true,
    });
  }
}

/****************** INSERTA LOS DATOS EN EL FORMULARIO DE EDITAR USUARIOS ***************/
  export function insertDataFormUser(e) {
  const formUser = d.getElementById('updateUser');
  formUser.name.value = e.target.dataset.nombreusuario;
  formUser.email.value = e.target.dataset.correo;
  formUser.rol.value = e.target.dataset.rol
  formUser.idUser.value  = e.target.dataset.id
}

/****************** LIMPIA LOS DATOS EN LOS FORMULARIOS DE  USUARIOS ***************/

  export function  clearDataForm(formId){
  const formUser = d.getElementById(formId);
  formUser.name.value = "";
  formUser.email.value = "";
  formUser.rol.value = "",
  formUser.password.value = ""
}
