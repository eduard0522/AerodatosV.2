import { openModal } from "./modals.js";
const d = document;
const $rol = d.querySelector(".rol-header");
let $token;

d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

async function validateToken(req, res) {
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
    let res = await axios("http://localhost:3200/validateToken", options);

    $rol.textContent = res.data.rol;
     
    if (!sessionStorage.tok) {
       openModal("pop-up", "hidden");
    }

     d.addEventListener("click", (e) => {
      if (e.target.matches(".login")) {
          if (!sessionStorage.tok) { window.location = "/";
        }}

        if (e.target.matches(".closed-notifications")) {
          document.querySelector('.notification').classList.add('hidden-notification');
        }
        if (e.target.matches(".show-notifications")) {
          document.querySelector('.notification').classList.remove('hidden-notification');
        }
    });
    
  } catch (error) {
    
     res.status(error?.status || 500)
     res.send({ status: "FAILED", data: { error: error?.message || error } }); 
  }
}