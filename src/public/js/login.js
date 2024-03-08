import { openModal } from "./modals.js";

const d = document;
const $form = document.querySelector(".form-user");
let $token = ''

 async function createFile(e) {
  try {
    console.log('ingreso');
    let options = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
         data: JSON.stringify({
          userName: e.target.userName.value,
          password: e.target.password.value
      }),
    };

    let res = await axios("http://localhost:3200/login", options);
    sessionStorage.setItem('tok',res.data.data.token)
    openModal('pop-up','hidden')
  
  } catch (err) {
 
    let message =err || "Ocurrio un error";
   
  alert(`Error: ${message}`);
  }
}


 
 async function validateToken(e) {
  $token = sessionStorage.getItem('tok');
  console.log($token)
  try {
    console.log('ingreso');
    let options = {
      method: "GET",
      headers: 
      { "Autorizathion":$token,
        "Content-type": "application/json;charset=utf-8",
       },
    };
    let res = await axios("http://localhost:3200/token", options);

  if(res.data.data === 'Administrador'){
    location.href = "admin/index"
  }else if(res.data.data === 'Usuario'){
    location.href = "user/index"
  }
    
  
  } catch (err) {
 
    let message =err || "Ocurrio un error";
   
  alert(`Error: ${message}`);
  }
} 


d.addEventListener("submit", async  (e) => {
 
 if(e.target === $form )
  e.preventDefault();
  createFile(e);
});

 d.addEventListener("click", (e) => {

  if(e.target.matches('.login')){
    validateToken()
 }
});