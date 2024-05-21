import { agregarToast } from "./toast.js";
const d = document;
const $rol = d.querySelector(".rol-header");
let $token;


d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

async function validateToken(req, res) {
  $token = sessionStorage.getItem("tok");
  console.log($token)
  try {
    console.log("ingreso");
    let options = {
      method: "GET",
      headers: {
        authorization: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };

    let res = await axios(`/verifytokenUser`, options);
 
    $rol.textContent = res.data.rol;
   if (res.data.status === 403) {

    location.href = '/403' 
   }

  } catch (error) {
    console.log(error)
    location.href = '/403' 
  }
}


d.addEventListener("click", (e) => {

  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }
  if (e.target.matches(".search")) {
   window.location.href = '/user/expedientes'
  }
  if (e.target.matches(".logout")) {
    sessionStorage.setItem('tok','')
    location.href ='/'
   }

  if (e.target.matches(".bug")) {
    agregarToast({
      tipo: "warning",
      titulo: "Upps!!",
      descripcion: "Función en desarrollo",
      autocierre: true,
    });
  }
});
