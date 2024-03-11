
const d = document;
const $form = d.querySelector('.form-file');
const $tittle = d.querySelector('.crud-tittle')

export async function createExpedient(e) {

  console.log(typeof e.target.serie.value)
  try{
    let options = {
      method:"POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        expediente:e.target.expediente.value,
        carpeta:e.target.carpeta.value ,
        dependencia:parseInt(e.target.dependencia.value),
        referencia:parseInt(e.target.dependencia.value),
        caja:parseInt(e.target.caja.value),
        serie:parseInt(e.target.serie.value),
        subserie:parseInt(e.target.subserie.value),
        estante:parseInt(e.target.estante.value),
        pasillo: parseInt(e.target.pasillo.value),
        cuerpo:e.target.cuerpo.value,
        entrepanio:parseInt(e.target.entrepanio.value)
      }),
    };
    console.log(options.data)
    let res = await axios(`http://localhost:3200/expedientes`,options)
    alert(`${res.data.message}`);
    location.reload()

  }catch(error){
    alert(`Error: ${error.status} , ${error.message}`);
  }
}

export async function editExpedient(e) {

  console.log(typeof e.target.serie.value)
  try{
    let options = {
      method:"PATCH",
      headers: { "Content-type": "application/json; charset=utf-8" },
       data:JSON.stringify({
        expediente:e.target.expediente.value,
        carpeta:e.target.carpeta.value ,
        dependencia:parseInt(e.target.dependencia.value),
        referencia:parseInt(e.target.dependencia.value),
        caja:parseInt(e.target.caja.value),
        serie:parseInt(e.target.serie.value),
        subserie:parseInt(e.target.subserie.value),
        estante:parseInt(e.target.estante.value),
        pasillo: parseInt(e.target.pasillo.value),
        cuerpo:e.target.cuerpo.value,
        entrepanio:parseInt(e.target.entrepanio.value)
      }),
    };
    console.log(options.data)
    console.log(e.target.idHidden.value)
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/expedientes/${e.target.idHidden.value}`,options)
    alert(`${res.data.message}`);
   


  }catch(error){
    alert(`Error: ${error.status} , ${error.message}`);
  }
}





export async function insertDateForm(e){

  $tittle.textContent = "Editar Expediente";
  d.querySelector(".buttonReg").textContent = "Actualizar"
  $form.expediente.value = e.target.dataset.expediente;
  $form.referencia.value = e.target.dataset.referencia;
  $form.serie.value = e.target.dataset.serie;
  $form.subserie.value = e.target.dataset.subserie;
  $form.pasillo.value = e.target.dataset.pasillo;
  $form.cuerpo.value = e.target.dataset.cuerpo;
  $form.estante.value = e.target.dataset.estante;
  $form.entrepanio.value = e.target.dataset.entrepanio;
  $form.caja.value = e.target.dataset.caja;
  $form.carpeta.value = e.target.dataset.carpeta;
  $form.dependencia.value = e.target.dataset.dependencia;
  
  $form.idHidden.value = e.target.dataset.id;
}

export async function clearDateForm(e){

  $tittle.textContent = "Realizar nuevo registro";
  d.querySelector(".buttonReg").textContent = "Registrar"
  $form.expediente.value = "";
  $form.referencia.value = "";
  $form.serie.value ="";
  $form.subserie.value = "";
  $form.pasillo.value = "";
  $form.cuerpo.value ="";
  $form.estante.value ="";
  $form.entrepanio.value = "";
  $form.caja.value = "";
  $form.carpeta.value = "";
  $form.dependencia.value = "";
  
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
        let res = await axios(`https://aerodatos-v10-production.up.railway.app/expedientes/${e.target.dataset.id}`, options),
          json = await res.data;
          alert(res.data.message)
          location.reload(); 
      }catch (err) {
        let message = err.statusText || "Ocurrio un error";
        alert(` Error ${err.status}: ${message}`)
      }
   }
}

