
const d = document;
let $token;
const $formFilter = d.getElementById('formFilters');
/********* FUNCION PARA VALIDAR ELTOKEN Y ASI MISMO EL PERMISO, SE EJECUTA A LA CARGA DEL DOM  ******/

async function validateToken() {
  $token = sessionStorage.getItem("tok");
  try {
    let options = {
      method: "GET",
      headers: {
        "Authorization":$token ,
        "Content-type": "application/json;charset=utf-8",
      },
    };
    let res = await axios(`/verifyToken`, options);
    if (res.status === 403) {
      location.href = '/403'
     }
  } catch (error) {
   if(error.response.status === 403){
    location.href = '/403'
   }
  }
}
d.addEventListener("DOMContentLoaded", (e) => {
  validateToken();
  if( d.getElementById(`${sessionStorage.getItem('page')}`)){
    d.getElementById(`${sessionStorage.getItem('page')}`).style.background = '#0b275f'
  }
});

async function getExpedientsPage(page) {
  try {
   location.href=`/user/expedientes?page=${page}`;
  }catch(error){
    console.log(error)
  }
}

d.addEventListener('submit', (e) => {
  if(e.target === $formFilter){
    e.preventDefault();

    if(e.target.expedient.value && e.target.name.value ){
       return location.href=`/user/filter?expedient=${e.target.expedient.value}&name=${e.target.name.value}` 
    } 
    if(e.target.name.value){
      return location.href=`/user/filter?name=${e.target.name.value}` 
    }
    if(e.target.expedient.value){
       return location.href=`/user/filter?expedient=${e.target.expedient.value}` 
   
    }
 }
})


d.addEventListener('click', (e) => {
  if (e.target.matches(".pageIndex") ) {
    sessionStorage.setItem('page', e.target.id)
    getExpedientsPage(e.target.id)
  }
})