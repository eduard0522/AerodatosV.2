export function openModal( id,classHidden){
  const $Modal = document.getElementById(id)
  $Modal.classList.remove(classHidden);
}

export function ClosedModal( id,classHidden){
  const $form = document.getElementById(id)
  $form.classList.add(classHidden);
}
