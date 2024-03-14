
const d = document;
const $rol = d.querySelector(".rol-header");
let $token;


d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
});

async function validateToken(req, res) {
  $token = sessionStorage.getItem("tok");

  try {
    let options = {
      method: "GET",
      headers: {
        Autorizathion: $token,
        "Content-type": "application/json;charset=utf-8",
      },
    };
    let res = await axios(`https://aerodatos-v10-production.up.railway.app/admin/index/verify`, options);

    $rol.textContent = res.data.rol;
    if (res.data.status === 403) {
      location.href = '/403'
     }
    
  } catch (error) {
    
     res.status(error?.status || 500)
     res.send({ status: "FAILED", data: { error: error?.message || error } }); 
  }
}

d.addEventListener("click", (e) => {
  if (e.target.matches(".closed-notifications")) {
    document.querySelector('.notification').classList.add('hidden-notification');
  }
  if (e.target.matches(".show-notifications") || e.target.matches(".container-notification")) {
    document.querySelector('.notification').classList.toggle('hidden-notification');
  }
  
  if (e.target.matches(".btn-menu") || e.target.matches(".icon-menu")) {
    document.querySelector('header').classList.toggle('menu-resposive');
  }
});