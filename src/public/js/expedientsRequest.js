import { ClosedModal } from "./modals.js";
import { agregarToast } from "./toast.js";


const d = document;
const $form = d.querySelector('.form-file');
const $tittle = d.querySelector('.crud-tittle')

export async function createExpedient(e) {
  try{
    let options = {
      method:"POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        nombre:e.target.nomExpediente.value,
        numero:e.target.expediente.value ,
        tipo:parseInt(e.target.tipo.value),
        estado:parseInt(e.target.estado.value),
        nombre_serie: e.target.serieName.value,
        numero_serie: parseInt(e.target.serieNum.value),
        caja:parseInt(e.target.caja.value),
        estante:parseInt(e.target.estante.value),
        pasillo: e.target.pasillo.value.toString()
      }),
    };
    console.log(options.data)
       let res = await axios(`/expedientes`,options) 
         ClosedModal('form','hidden')
        agregarToast({tipo:'exito',titulo:'Excelente!', descripcion:`${res.data.message}`, autocierre:true})
    setTimeout(() => {
      location.reload()
    }, 5000); 
   
  }catch(error){
    agregarToast({tipo:'error',titulo:'Error!', descripcion:`${error.response.data.message}`, autocierre:true})
    setTimeout(() => {
      location.reload()
    }, 5000);
  }
}


export async function editExpedient(e) {
  try{
    let options = {
      method:"PATCH",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        nombre:e.target.nomExpediente.value,
        numero:e.target.expediente.value ,
        tipo:parseInt(e.target.tipo.value),
        estado:parseInt(e.target.estado.value),
        nombre_serie: e.target.serieName.value,
        numero_serie: parseInt(e.target.serieNum.value),
        caja:parseInt(e.target.caja.value),
        estante:parseInt(e.target.estante.value),
        pasillo: e.target.pasillo.value.toString()
      }),
    };
    console.log(options.data)
    console.log(e.target.idHidden.value)
     let res = await axios(`/expedientes/${e.target.idHidden.value}`,options)
    
    ClosedModal('form','hidden')
    agregarToast({tipo:'exito',titulo:'Excelente!', descripcion:`${res.data.message}`, autocierre:true})
    setTimeout(() => {
      location.reload()
    }, 5000);
 
  }catch(error){
    alert(`Error: ${error.status} , ${error.message}`);
  }
}

export async function insertDateForm(e){

  $tittle.textContent = "Editar Expediente";
  d.querySelector(".buttonReg").textContent = "Actualizar"
  $form.expediente.value = e.target.dataset.expediente;
  $form.nomExpediente.value = e.target.dataset.nombre;
  $form.tipo.value = e.target.dataset.tipo;
  $form.pasillo.value = e.target.dataset.pasillo;
  $form.estante.value = e.target.dataset.estante;
  $form.caja.value = e.target.dataset.caja;
  $form.serieName.value = e.target.dataset.serie;
  $form.serieNum.value = e.target.dataset.numserie;
  $form.estado.value = e.target.dataset.estado;
  $form.idHidden.value = e.target.dataset.id;
}

export async function clearDateForm(e){

  $tittle.textContent = "Realizar nuevo registro";
  d.querySelector(".buttonReg").textContent = "Registrar"
  $form.expediente.value = "";
  $form.nomExpediente.value = "";
  $form.tipo.value = "";
  $form.pasillo.value = "";
  $form.estante.value = "";
  $form.caja.value = "";
  $form.serieName.value = "" ;
  $form.serieNum.value = "";
  $form.estado.value = "";
  $form.idHidden.value = "";
  
}


export async function deleteFile(e) {

  let isDelete = confirm(` ¿Estás seguro de eliminar este registro?`);
  if(isDelete){
    try {
        let options = {
          method: "DELETE",
          headers: {"Content-type": "application/json; charset=utf-8" },
        }
        let res = await axios(`/expedientes/${e.target.dataset.id}`, options),
          json = await res.data;
          agregarToast({tipo:'info',titulo:'Muy bien!', descripcion:`${res.data.message}`, autocierre:true})
          setTimeout(() => {
            location.reload()
          }, 5000);
      }catch (err) {
        let message = err.statusText || "Ocurrio un error";
        agregarToast({tipo:'error',titulo:'Ocurrio un problema', descripcion:` Error ${err.status}: ${message}`, autocierre:true})
      }
   }
}

