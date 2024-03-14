import { ClosedModal, openModal } from "./modals.js";
import searchFilter from "./filters.js";
import { agregarToast } from "./toast.js";


const d = document;
const $rol = d.querySelector(".rol-header"),
$form = d.querySelector('.form-file')
let $token;


async function validateToken() {
  $token = sessionStorage.getItem("tok");
  try {
    console.log("ingreso");
    let options = {
      method: "GET",
      headers: {
        Autorizathion: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };

    
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/usuario/verify`, options);
    $rol.textContent =res.data.rol

/*     if (res.data.status === 403) {
      location.href = '/403'
     } */
     

  } catch (error) {
    agregarToast({
      tipo: "error",
      titulo: "Error!!",
      descripcion: "Ocurrio un error inesperado",
      autocierre: true,
    });
  }
}






export async function createNotification(e) {
  const date =  new Date();
  const dateTime = `${date.getFullYear()}-${ date.getMonth()}-${date.getDay()}`
  console.log(e.target)
  console.log( e.target.expediente.value , e.target.referencia.value,e.target.nombre.value,e.target.correo.value,e.target.fecha.value)
  try{
    let options = {
      method:"POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        expediente:e.target.expediente.value,
        referencia:e.target.referencia.value,
        solicitante: e.target.nombre.value,
        correo:e.target.correo.value,
        fecha_solicitud:dateTime,
      }),
    };
    console.log(options.data)
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/notificaciones`,options)
   
    agregarToast({tipo:'info',titulo:'Muy bien!', descripcion:`${res.data.message}`, autocierre:true})
    setTimeout(() => {
      location.reload()
    }, 5000);
   
    clearForm();
  }catch(error){
    agregarToast({tipo:'error',titulo:'Error', descripcion:`${error.message}}`, autocierre:true})
  } 
}


export async function createSolicitud(e) {

  const date =  new Date();
  const dateTime = `${date.getFullYear()}-${ date.getMonth()}-${date.getDay()}`
  
   try{
    let options = {
      method:"POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        expediente:e.target.expediente.value,
        referencia:e.target.referencia.value,
        solicitante: e.target.nombre.value,
        correo:e.target.correo.value,
        fecha_solicitud:dateTime,
        estado:true
      }),
    };
    console.log(options.data)
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/solicitudes`,options)
    createNotification(e)
  }catch(error){
    agregarToast({
      tipo: "error",
      titulo: "Error!!",
      descripcion: "Ocurrio un error inesperado",
      autocierre: true,
    });
  }  
}

d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
  searchFilter(".filter-data",".tr-filter");
});

d.addEventListener('click', (e) =>{
  if(e.target.matches('.send-appli')){
    insertDateForm(e)
    openModal('form-appli','hidden');
  }
  if(e.target.matches('.button-cancel-appli')){
    ClosedModal('form-appli','hidden');
  }
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    document.querySelector('.notification').classList.toggle('hidden-notification');
  }
    
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }
})


d.addEventListener('submit',(e)=>{
  if(e.target.matches('.form-file')){
    e.preventDefault()
    createSolicitud(e);
  }
})


 export async function insertDateForm(e){
  $form.expediente.value = e.target.dataset.expediente;
  $form.referencia.value = e.target.dataset.referencia;
  $form.fecha.value = dateTime;
  $form.dependencia.value = e.target.dataset.dependencia;
}

export async function clearForm(){
  $form.expediente.value = "";
  $form.correo.value = "";
  $form.Observaciones.value ="";
  $form.nombre.value ="";
  $form.referencia.value ="";
  $form.fecha.value = "";
  $form.dependencia.value = "";
  ClosedModal('form-appli','hidden');
}