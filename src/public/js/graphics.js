
import { openModal } from "./modals.js";
import {getRutas} from '../js/getRutas.js'

const d = document;
const $rol = d.querySelector(".rol-header");
let $token,
 total = d.querySelector('.span-total').textContent,
 abiertas = d.querySelector('.span-abiertas').textContent,
 cerradas = d.querySelector('.span-cerradas').textContent;

d.querySelector('.total').textContent = parseInt(total);
d.querySelector('.p-abiertas').textContent = parseInt(abiertas);
d.querySelector('.p-cerradas').textContent = parseInt(cerradas);
d.querySelector('.efecty').textContent = `${parseFloat(abiertas*100/total).toFixed(1)}%`;

d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
  getRutas(parseInt(total), parseInt(abiertas),parseInt(cerradas));
});

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
    let res = await axios("https://aerodatos-v10-production.up.railway.app/validateToken", options);

    console.log(res.data.rol)
    $rol.textContent = res.data.rol

    if (!sessionStorage.tok || res.data.rol === "Usuario") {
      openModal("pop-up", "hidden");
   }
     d.addEventListener("click", (e) => {
       if (e.target.matches(".login")) {

         if (!sessionStorage.tok) { window.location = "/";
       } else if (res.data.rol === "Usuario") {
        window.location = "user/expedientes";
       }}
       if (e.target.matches(".closed-notifications")) {
        document.querySelector('.notification').classList.add('hidden-notification');
      }
      if (e.target.matches(".show-notifications")) {
        document.querySelector('.notification').classList.remove('hidden-notification');
      }
     });
  } catch (error) {
    res.status(error?.status || 500);
    res.send({ status: "FAILED", data: { error: error?.message || error } });
  }

   validateDate('.fechaS')
    validateDate('.fechaC')
}



export async function updateSolicitud(id, estado,fecha_cierre) {
  try {
    let options = {
      method: "PATCH",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
      data: JSON.stringify({
        fecha_cierre,
        estado,
      
      }),
    };
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/solicitudes/${id}`, options),
      json = await res.data;
      alert("Actualización exitosa!!");
      location.reload();
  } catch (err) {
    let message = err.statusText || "Ocurrio un error";
    alert(message);
  }
}




export async function deleteSolicitud(id) {
  let isDelete = confirm(` ¿Estás seguro de eliminar este registro?`);
  if (isDelete) {
    try {
      let options = {
        method: "DELETE",
        headers: { "Content-type": "application/json; charset=utf-8" },
      };
      let res = await axios(
          `https://aerodatos-v10-production.up.railway.app/solicitudes/${id}`,
          options
        ),
        json = await res.data;
        alert("Solicitud eliminada con éxito");
        location.reload();
    } catch (err) {
      let message = err.statusText || "Ocurrio un error";
      alert(` Error ${err.status}: ${message}`);
    }
  }
}


function validateDate(input){

  const $date = document.querySelectorAll(input);

  $date.forEach(element => {
    let date = element.textContent;
    const fecha = new Date(date)

    console.log(fecha)

    if(fecha == 'Invalid Date'){
      element.textContent =' N/A';
      return
    } 
    element.textContent = `${fecha.toLocaleDateString()}`;
  });

}


const date =  new Date();
const dateTime = `${date.getFullYear()}-${ date.getMonth()}-${date.getDay()}`


d.addEventListener('click', (e)=>{
  if(e.target.matches('.btn-cerrar')){
   
    updateSolicitud(e.target.dataset.id , 0, dateTime)
  }

  if(e.target.matches('.btn-abrir')){
    updateSolicitud(e.target.dataset.id, 1, dateTime)
  }

  if(e.target.matches('.delete')){
    deleteSolicitud(e.target.dataset.id)
  }
})