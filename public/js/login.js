import { openModal } from "./modals.js";
import { agregarToast } from "./toast.js";

const d = document;
const $form = document.querySelector(".form-user");


d.addEventListener('DOMContentLoaded' , (e) => {
  sessionStorage.setItem("tok",'');
})
async function Validatelogin(e) {
  try {
    let options = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
      data: JSON.stringify({
        email: e.target.userName.value,
        password: e.target.password.value,
      }),
    };
    let res = await axios(
      '/login',
      options
    );
    console.log(res.data.token)
    console.log(res.data.Usuario.rol)
    sessionStorage.setItem("tok", res.data.token);
    openModal("pop-up", "hidden");

    agregarToast({
      tipo: "exito",
      titulo: "Exelente!!",
      descripcion: "Bienvenido de vuelta",
      autocierre: true,
    });
    

     d.addEventListener("click", (e) => {
      if (e.target.matches(".login")) {
        if ( res.data.Usuario.rol== "Administrador" || res.data.Usuario.rol == "administrador") {
          location.href = "/index";
          
        } else if ( res.data.Usuario.rol == "Usuario" || res.data.Usuario.rol == "usuario") {
          location.href = "user/index";}
      }
    }) ;

  } catch (err) {
    agregarToast({
      tipo: "error",
      titulo: "Error!",
      descripcion: "Usuario o clave incorrecta",
      autocierre: true,
    });
  }
}
  
d.addEventListener("submit", async (e) => {
  if (e.target === $form) e.preventDefault();
  Validatelogin(e);
});



