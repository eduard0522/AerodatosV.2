
import { createExpedient, editExpedient, insertDateForm,clearDateForm, deleteFile } from "./expedientsRequest.js";
import { ClosedModal, openModal } from "./modals.js";
import searchFilter from "./filters.js";

const d = document;
const $rol = d.querySelector(".rol-header");
const $form = d.querySelector('.form-file');
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
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/validateToken`, options);
    $rol.textContent =res.data.rol

     if (!sessionStorage.tok || res.data.rol === "Usuario") {
       openModal("pop-up", "hidden");
    }
      d.addEventListener("click", (e) => {
        if (e.target.matches(".login")) {

          if (!sessionStorage.tok) { window.location = "/";
        } else if (res.data.rol === "Usuario") {
          window.location = "user/expedientes";
        }}
      });
  } catch (error) {
    res.status(error?.status || 500);
    res.send({ status: "FAILED", data: { error: error?.message || error } });
  }
}


d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

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
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    document.querySelector('.notification').classList.toggle('hidden-notification');
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

