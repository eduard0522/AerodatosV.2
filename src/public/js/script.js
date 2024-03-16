import { ClosedModal, openModal } from "./modals.js";
import { agregarToast } from "./toast.js";
const d = document;
const $rol = d.querySelector(".rol-header");
let $token;
let banner ;


d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

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

d.addEventListener("click", (e) => {
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    document.querySelector('.notification').classList.toggle('hidden-notification');
  }
  
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }
  if (e.target.matches(".option-base") || e.target.matches(".base-div") || e.target.matches('.fa-database')) {
    openModal('updateBanner','hidden');
  }
  if (e.target.matches(".closedForm")) {
    ClosedModal('updateBanner','hidden');
  }

  
});



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

async function  sendFile() {
  try {
    let options = {
      method: "POST",
      headers: { "Content-type": "multipart/form-data; charset=utf-8" },
      data: new FormData($form)
    };

  const res = await axios("/updateBanner",options)
    agregarToast({
      tipo: "exito",
      titulo: "Exelente!!",
      descripcion: "Actulización Exitosa",
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
      setTimeout(() => {
        location.reload()
      },5000)
  }
} 



$btn.addEventListener('click' , (e) => {
  const file = document.getElementById('inputBanner');
  if(!file === ''){
    alert(' no pueden quedar campos vacios');

  }else{
     sendFile() 
  }
})
