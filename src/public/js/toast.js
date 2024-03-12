const d = document

const contenedorToast = d.getElementById('contenedor-toast');

  
  

// eventlistener detectar click en los toast 

contenedorToast.addEventListener('click',(e) =>{
  const toastId = e.target.closest('div.toast').id
 if(e.target.closest('button.btn-cerrarToast')){
  CerrarToast(toastId)
 }  
});

const CerrarToast = (id) =>{
  d.getElementById(id)?.classList.add('cerrando');
}

export const agregarToast = ({tipo,titulo,descripcion,autocierre}) =>{
  console.log(tipo,titulo,descripcion,autocierre)
  const nuevoToast = d.createElement('div');
  nuevoToast.classList.add('toast')
  nuevoToast.classList.add(tipo)

  if(autocierre) nuevoToast.classList.add('autoCierre');


  const numeroAzar = Math.floor(Math.random()*100);
  const fecha = Date.now()
  const toastId = fecha + numeroAzar;
  nuevoToast.id=toastId;

  // agregar icono

  const iconos = {
    exito :`<i class="bi bi-check-circle-fill"></i>`,
    error :`<i class="bi bi-bug"></i>`,
    info :` <i class="bi bi-info-circle-fill"></i>`,
    warning :`<i class="bi bi-exclamation-octagon"></i>`,
  }


  // plantilla

  const toast = `
  <div class="contenido">
        <div class="icono">
        ${iconos[tipo]}
        </div>
        <div class="texto">
          <p class="titulo">${titulo}</p>
          <p class="descripcion">${descripcion}</p>
        </div>
  </div>
  <button class="btn-cerrarToast">X</button>
  `;
  // agregar la pllantilla

  nuevoToast.innerHTML = toast;

  // agregar toast al contenedor 

  contenedorToast.appendChild(nuevoToast);

  // funcion para manejar el cierre del toast

  const handleAnimacionToast = (e) =>{
    if(e.animationName === 'cierre'){
      nuevoToast.removeEventListener('animationend', handleAnimacionToast)
      nuevoToast.remove();

    }
  }

  if(autocierre){
    setTimeout(() => {
      CerrarToast(toastId)
    }, 6000);
  }
  nuevoToast.addEventListener('animationend', handleAnimacionToast)
    
}