
import { createExpedient, editExpedient, insertDateForm,clearDateForm, deleteFile } from "./expedientsRequest.js";
import { ClosedModal, openModal } from "./modals.js";
import searchFilter from "./filters.js";
import { getRutas } from "./getRutas.js";

const d = document;
const $rol = d.querySelector(".rol-header");
const $form = d.querySelector('.form-file');
let $token;

d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
  getTotalExpedients()
});


/********* FUNCION PARA VALIDAR ELTOKEN Y ASI MISMO EL PERMISO, SE EJECUTA A LA CARGA DEL DOM  ******/
async function validateToken() {
  $token = sessionStorage.getItem("tok");
  console.log($token)
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

async function getTotalExpedients() {
  try {
    const res = await axios('/expedientes/total');
    let total = res.data.total[0].total
    let organizados = res.data.organizados[0].total
    let sinOrganizar = res.data.sinOrganizar[0].total
    getRutas(total, sinOrganizar,organizados);
    insertDataGrafics(total,organizados,sinOrganizar)

  } catch (error) {
    console.log(error)
  }
}


d.addEventListener('click',(e) => {
  if(e.target.matches('.register') ||  e.target.matches('.button-active-form')){
    openModal('form','hidden')}

  if(e.target.matches('.button-cancel-form')){
    clearDateForm(e)
    ClosedModal('form','hidden')}

  if(e.target.matches('.edit')){
    openModal('form','hidden');
    insertDateForm(e)
      console.log(e.target)}

  if(e.target.matches('.delete')){
    deleteFile(e)
  }
 
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }

  searchFilter(".filter-data",".tr-filter");
  });


d.addEventListener('submit', (e) => {
  if(e.target === $form){
    e.preventDefault();
    if(!e.target.idHidden.value){ 
      createExpedient(e);;
    }else{
      editExpedient(e);
    } 
  }
});

function  insertDataGrafics(total,organizados,sinOrganizar) {
  const $spanOrganizados = d.querySelector('.p-organizados');
  const $spanSinOrganizar = d.querySelector('.p-sinOrganizar');
  const $spanTotal = d.querySelector('.total');
  const $spanPromedio = d.querySelector('#efecty-span');
  const promedioOrganizacion =  organizados *100 / total;

  $spanOrganizados.textContent = `${organizados}`;
  $spanSinOrganizar.textContent = `${sinOrganizar}`;
  $spanTotal.textContent = `${total}`;  
  $spanPromedio.textContent = `${promedioOrganizacion.toFixed(0)}%`
}

