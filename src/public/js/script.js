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

/********* FUNCION PARA VALIDAR ELTOKEN Y ASI MISMO EL PERMISO, SE EJECUTA A LA CARGA DEL DOM  ******/
async function validateToken() {
  $token = sessionStorage.getItem("tok");
  try {
    let options = {
      method: "GET",
      headers: {
        "Authorization":$token ,
        "Content-type": "application/json;charset=utf-8",
      },
    };
    let res = await axios(`/verifyToken`, options);
    if (res.status === 403) {
      location.href = '/403'
     }
  } catch (error) {
   if(error.response.status === 403){
    location.href = '/403'
   }
  }
}

/**********************    FUNCION PARA ENVIAR LA IMAGEN DEL BANNER AL SERVIDOR  ************/
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


/************************** SELECCIONAR ARCHIVO EXCEL  *******************/

const $btnExcel = d.getElementById('activeInputFile');
const $excelInput = d.getElementById('excelFile');
const $textFile = d.querySelector('.textFile')
const $sendFile = d.getElementById('sendFile');
let fileExcel  ; 
 
$btnExcel.addEventListener('click' , () => {
  $excelInput.click();
  $excelInput.addEventListener('change', (e) =>{
    if(e.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e)  => {
        $textFile.innerText = 'Archivo seleccionado.'
        fileExcel = e.target.result;
      }
      reader.readAsDataURL(e.target.files[0])
   
    }else{
     console.log('no hay archivo');
    }
  }) 
})

$sendFile.addEventListener('click',(e) => loadFile())
function  loadFile() {
  console.log('clock')
    let formData = new FormData();
    let file =  d.getElementById('excelFile').files[0];
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten archivos de tipo .xlsx o .xls');
      }
    }
    formData.append('excelFile', file);

    sendExcel(formData)
;
}

async function sendExcel(data) {

  try {
    let res = await axios('/uploadFile',{
      method: 'POST',
      data: data,
    });
    if(res.status === 200){
      agregarToast({
        tipo: "info",
        titulo: "Archivo enviado.",
        descripcion: "El archivo fue enviado correctamente.",
        autocierre: true,
      });
      console.log(res.data)
      ClosedModal('loadFile', 'hidden');
      d.querySelector('.textInsert').textContent = `Total insertados : ${res.data.result.totalInsertados}`;
      d.querySelector('.textFailed').textContent = `Fallidos : ${res.data.result.faileds.length}`;
        for(let failed of res.data.result.faileds){
          d.querySelector('.listFaileds').innerHTML += `<li>  ${failed} </li>`
        }
  
      openModal('infoFile','hidden')
    }else{
      agregarToast({
        tipo: "error",
        titulo: "Error",
        descripcion: "Ocurrio un error, intenta de nuevo",
        autocierre: true,
      });
    }
  } catch (error) {
    console.log(error.message)
    agregarToast({
      tipo: "error",
      titulo: "Error",
      descripcion: "Ocurrio un error, intenta de nuevo mas tarde",
      autocierre: true,
    });
  }
}

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
   window.location.href = '/expedientes'
   }

   if (e.target.matches(".graphic")) {
    openModal('loadFile', 'hidden')
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
    openModal('loadFile', 'hidden')
   }
   if (e.target.matches(".closeForm")) {
      ClosedModal('pop-up', 'hidden');
      ClosedModal('loadFile', 'hidden')
   }
   if (e.target.matches(".closeInfo")) {
    ClosedModal('infoFile', 'hidden')
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


