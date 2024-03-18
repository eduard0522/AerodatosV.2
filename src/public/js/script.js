import { ClosedModal, openModal } from "./modals.js";
import { agregarToast } from "./toast.js";
const d = document;
const $rol = d.querySelector(".rol-header");
const $linkBanner = d.querySelector('.link-banner');
let $token;
let banner ;



d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});


/**************************** FUNCION PARA VALIDAR ELTOKEN Y ASI MISMO EL PERMISO, SE EJECUTA A LA CARGA DEL DOM  ***********************/
async function validateToken(req, res) {
  $token = sessionStorage.getItem("tok");

  try {
    let options = {
      method: "GET",
      headers: {
        Autorizathion: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };
    let res = await axios(`/admin/index/verify`, options);

    $rol.textContent = res.data.rol;
    if (res.data.status === 403) {
      location.href = '/403'
     }
    
  } catch (error) {
    
     res.status(error?.status || 500)
     res.send({ status: "FAILED", data: { error: error?.message || error } }); 
  }
}



/*************************************    FUNCION PARA ENVIAR LA IMAGEN DEL BANNER AL SERVIDOR  ***************************/

async function  sendFile() {
  try {
    let options = {
      method: "POST",
      headers: { "Content-type": "multipart/form-data; charset=utf-8" },
      data: new FormData($form)
    };

  const res = await axios("/updateBanner",options)

  console.log(res)

    agregarToast({
      tipo: "exito",
      titulo: "Exelente!!",
      descripcion: "Actualización Exitosa",
      autocierre: true,
    });
    setTimeout(() => {
      location.reload()
    },5000)
  
  } catch (error) {
    console.log(error)
      agregarToast({
        tipo: "error",
        titulo: "Error!",
        descripcion: "Ocurrio un error, intenta de nuevo",
        autocierre: true,
      });
     /*  setTimeout(() => {
        location.reload()
      },5000) */
  }
} 


/**************************  SELECCIONAR IMAGEN DE BANNER Y COLOCARLA EN EL BANNER COMO PREVIEW,
                                   SI DECIDE DEJARLA ENVIA LA IMAGEN AL SERVIDOR Y LA ACTUALIZA     ******************/


const $btn = d.getElementById('boton');
const $btnInput = d.getElementById('activeInput');
const $bannerInput = d.getElementById('inputBanner');
const $imageBanner = document.getElementById('banner');
const $form = d.getElementById('form')


$btnInput.addEventListener('click',(e) =>{
  if($bannerInput){
    $bannerInput.click();
  }
})
  
$bannerInput.addEventListener('change', (e) =>{
  if(e.target.files[0]){
    banner = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e)  => {
      $imageBanner.src = e.target.result
    }
    reader.readAsDataURL(e.target.files[0])
 
  }else{
    $imageBanner.src = urlDefault
  }
}) 

$btn.addEventListener('click' , (e) => {
  const file = document.getElementById('inputBanner');
  if(!file === ''){
    alert(' no pueden quedar campos vacios');

  }else{
     sendFile() 
  }
})






/*********************************************  ESCUCHADOR DE EVENTOS CLICK  **********************************/

d.addEventListener("click", (e) => {
  if (e.target.matches(".closed-notifications")) {
    d.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    d.querySelector('.notification').classList.toggle('hidden-notification');
  }
  
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    d.querySelector('header').classList.toggle('menu-resposive');
  }
  if (e.target.matches(".update-banner")) {
    d.querySelector('.config-options').classList.add('hidden')
    openModal('updateBanner','hidden');
  }
  if (e.target.matches(".closedFormBanner")) {
    ClosedModal('updateBanner','hidden');
  }
  if (e.target.matches(".fa-gear")) {
    d.querySelector('.config-options').classList.toggle('hidden')
  }

  if (e.target.matches(".download")) {
   openModal('pop-up', 'hidden');
  }
  if (e.target.matches(".cancel-download")) {
   ClosedModal('pop-up', 'hidden');
  }
  if (e.target.matches(".base")) {
   window.location.href = '/base'
   }
   if (e.target.matches(".graphic")) {
    window.location.href = '/solicitudes'
   }
   if (e.target.matches(".updateUser")) {
    agregarToast({
      tipo: "warning",
      titulo: "Opps!!",
      descripcion: "Función en desarrollo",
      autocierre: true,
    });
   }

  if (e.target.matches(".update-link-icon")) {
    ClosedModal('pop-up', 'hidden');
    agregarToast({
      tipo: "warning",
      titulo: "Opps!!",
      descripcion: "Función en desarrollo",
      autocierre: true,
    });
   }
  if (e.target.matches(".download-ok")) {
    ClosedModal('pop-up', 'hidden');
    agregarToast({
      tipo: "info",
      titulo: "Exelente!!",
      descripcion: "Plantilla descargada",
      autocierre: true,
    });
  }
});


