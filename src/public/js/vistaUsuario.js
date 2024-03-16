
import { ClosedModal, openModal } from "./modals.js";
import searchFilter from "./filters.js";
import { insertDateForm } from "./usuario.js";
import { agregarToast } from "./toast.js";

const d = document;
let $token;

async function validateToken() {
  $token = sessionStorage.getItem("tok");
  try {
      let options = {
        method: "GET",
        headers: {
          Autorizathion: $token,
          "Content-type": "application/json;charset=utf-8",
        },
      };
      let res = await axios(`/user/expedientes/verify`, options);
      if (res.data.status === 403) {
            console.log(res.data)
        /* location.href = '/403' */
      }


  } catch (error) {
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

d.addEventListener('submit',(e)=>{
  if(e.target.matches('.form-file')){
    e.preventDefault()
    createSolicitud(e);
  }
})




d.addEventListener('click', (e) =>{
  if(e.target.matches('.send-appli')){
    insertDateForm(e)
    openModal('form-appli','hidden');
  }
  if(e.target.matches('.button-cancel-appli')){
    ClosedModal('form-appli','hidden');
  }
})


 
