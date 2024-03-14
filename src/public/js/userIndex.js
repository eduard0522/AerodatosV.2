import { agregarToast } from "./toast.js";
const d = document;
const $rol = d.querySelector(".rol-header");
let $token;

console.log('ingreso al index')
d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

async function validateToken(req, res) {
  $token = sessionStorage.getItem("tok");
  console.log('validar token')
  try {
    console.log("ingreso");
    let options = {
      method: "GET",
      headers: {
        Autorizathion: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };

    let res = await axios(`https://aerodatos-v10-production.up.railway.app/user/index/verify`, options);
    $rol.textContent = res.data.rol;
   if (res.data.status === 403) {
    location.href = '/403'
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


d.addEventListener("click", (e) => {
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications")) {
    document.querySelector('.notification').classList.remove('hidden-notification');
  }
});
