import { openModal } from "./modals.js";
import { agregarToast } from "./toast.js";

const d = document;
const $form = document.querySelector(".form-user");
let $token = "";

async function Validatelogin(e) {
  try {
    let options = {
      method: "POST",
      headers: { "Content-type": "application/json; charset=utf-8" },
      // DATOS EN FORMATO JSON
      data: JSON.stringify({
        userName: e.target.userName.value,
        password: e.target.password.value,
      }),
    };

    let res = await axios(
      `/login`,
      options
    );

    console.log(res , 'Respuesta desde login')

    sessionStorage.setItem("tok", res.data.data.token);

    openModal("pop-up", "hidden");

    agregarToast({
      tipo: "exito",
      titulo: "Exelente!!",
      descripcion: "Bienvenido de vuelta",
      autocierre: true,
    });


    d.addEventListener("click", (e) => {
      if (e.target.matches(".login")) {
        if (res.data.data.rol == "Administrador" || res.data.data.rol == "administrador") {
          location.href = "admin/index";
        } else if (res.data.data.rol == "Usuario" || res.data.data.rol == "usuario") {
          location.href = "user/index";}
      }
    })

  } catch (err) {
    console.log(err);
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



