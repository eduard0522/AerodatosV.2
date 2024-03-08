import z from 'zod'

const expedientSchema = z.object({
  expediente:z.string({
    invalid_type_error:'El expediente debe ser un String',
    required_error:'El expediente es requerido'
  }),
  referencia:z.number({
    invalid_type_error:'La referencia debe ser de tipo numerica',
    required_error:'El campo referencia es requerido'
  }),
  dependencia:z.number({
    invalid_type_error:'La dependencia debe ser de tipo numerica',
    required_error:'El campo dependencia es requerido'
  }),
  serie:z.number({
    invalid_type_error:'La serie debe ser de tipo numerica',
    required_error:'El campo serie es requerido'
  }),
  subserie:z.number({
    invalid_type_error:'La subserie debe ser de tipo numerica',
    required_error:'El campo subserie es requerido'
  }),
  pasillo:z.number({
    invalid_type_error:'El campo pasillo debe ser de tipo numerico',
    required_error:'El campo pasillo es requerido'
  }),
  cuerpo:z.string({
    invalid_type_error:'El campo cuerpo debe ser un String',
    required_error:'El campo cuerpo es requerido'
  }),
  estante:z.number({
    invalid_type_error:'El campo estante debe ser un numerico',
    required_error:'El campo estante es requerido'
  }),
  entrepanio:z.number({
    invalid_type_error:'El campo entrepanio debe ser un numerico',
    required_error:'El campo entrepanio es requerido'
  }),
  caja:z.number({
    invalid_type_error:'El campo caja debe ser un string',
    required_error:'El campo estante es requerido'
  }),
  carpeta:z.string({
    invalid_type_error:'El campo carpeta debe ser un String',
    required_error:'El campo carpeta es requerido'
  }),
})


export function validateExpedient (input) {
  console.log('validando expediente')
  return expedientSchema.safeParse(input);
}
 export function validatePartialExpedient(input){
  return expedientSchema.partial().safeParse(input);
}