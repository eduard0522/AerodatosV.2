
export function contadorGraficas (elemento,contador) {
  
  const $idElement = document.querySelector(elemento);
  let cont = 0;

  let intervalContador = setInterval(()=>{

    $idElement.textContent = cont +=1
    if(cont >= contador){
      clearInterval(intervalContador);
    }
  },50)
  
}