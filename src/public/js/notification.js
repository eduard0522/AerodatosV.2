
const $template = document.querySelector('.notificationTemplate').content;
const $contenedor = document.querySelector('.notification'),
$fragment = document.createDocumentFragment();
let total = 0;


const getNotification = async () => {
    try {
      let res = await axios.get(`https://aerodatos-v10-production.up.railway.app//notificaciones`),
        json = await res.data.data;

        json.forEach(element => {
          $template.querySelector('.solicitante').textContent = `Solicitante:  ${element.solicitante}`;
          $template.querySelector('.expediente').textContent =  `Expediente:  ${element.expediente} `;
          $template.querySelector('.fecha').textContent = `Fecha:  ${element.fecha_solicitud}`;

          $template.querySelector('.closed').dataset.solicitante = element.solicitante;
          $template.querySelector('.closed').dataset.expediente = element.expediente;
          $template.querySelector('.closed').dataset.referencia = element.referencia;
          $template.querySelector('.closed').dataset.correo = element.correo;
          $template.querySelector('.closed').dataset.fecha_solicitud = element.fecha_solicitud;
          $template.querySelector('.closed').dataset.id = element.id_notificacion;
          
          let $clone = document.importNode($template, true);
          $fragment.appendChild($clone)
          total+= 1;
        });
        $contenedor.appendChild($fragment);
        localStorage.setItem('notificaciones',total)
        validateDate()
        addClassNotification()
      return 'ok'
      
    }catch(error){
      console.log(error)
    }
}


getNotification()

function validateDate(){
  const $date = document.querySelectorAll('.fecha');

  $date.forEach(element => {
    let date = element.textContent.split(" ")[2];
    const fecha = new Date(date)
    element.textContent = `F/solicitud: ${fecha.toLocaleDateString()}`;
  });
}


async function deleteNotification(id) {
  let isDelete = confirm(` ¿Estás seguro de eliminar la notificacion ?`);
  if(isDelete){
    try {
        let options = {
          method: "DELETE",
          headers: {"Content-type": "application/json; charset=utf-8" },
        }
        let res = await axios(`https://aerodatos-v10-production.up.railway.app/notificaciones/${id}`, options),
          json = await res.data;
          alert(res.data.message)
          console.log(res.data)
          
      }catch (err) {
        console.log(err)
        let message = err.statusText || "Ocurrio un error";
        alert(` Error ${err.status}: ${message}`)
    }
}
}

document.addEventListener('click',(e) =>{
  if(e.target.matches('.closed')){
  deleteNotification(e.target.dataset.id)
  console.log(e.target.dataset.id)
  }
})

const addClassNotification = () =>{

   document.querySelector('.notificationNunmber').textContent = `( ${localStorage.notificaciones} )`
  if(localStorage.notificaciones >= 1){
    document.querySelector('.fa-bell').classList.add('active-notification');
  }
}