
import { ClosedModal, openModal } from "./modals.js";
import searchFilter from "./filters.js";


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

    let res = await axios(`http://localhost:3200/validateToken`, options);
    $rol.textContent =res.data.rol

     if (!sessionStorage.tok ) {
       openModal("pop-up", "hidden");
    }
      d.addEventListener("click", (e) => {
        if (e.target.matches(".login")) {

          if (!sessionStorage.tok)  window.location = "/";
        }
      });
  } catch (error) {
    res.status(error?.status || 500);
    res.send({ status: "FAILED", data: { error: error?.message || error } });
  }
}


const date =  new Date();
const dateTime = `${date.getFullYear()}-${ date.getMonth()}-${date.getDay()}`

export async function createNotification(e) {
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
    let res = await axios(`http://localhost:3200/notificaciones`,options)
    alert(`${res.data.message}`);
    clearForm();
    location.reload()
  }catch(error){
    alert(`Error: ${error.status} , ${error.message}`);
  } 
}


async function createSolicitud(e) {

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
    let res = await axios(`http://localhost:3200/solicitudes`,options)
    alert(`${res.data.message}`);
    createNotification(e)
    location.reload()

  }catch(error){
    alert(`Error: ${error.status} , ${error.message}`);
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

