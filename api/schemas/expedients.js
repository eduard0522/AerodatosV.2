import z from 'zod'

//VALIDA LOS DATOS CARGADOS DESDE EL FORMULARIO

const expedientSchema = z.object({
  nombre:z.string({
    invalid_type_error:'El nombre expediente debe ser un String',
    required_error:'El expediente es requerido'
  }),
  numero:z.string({
    invalid_type_error:'El número de expediente debe ser de tipo String',
    required_error:'El campo número de expediente es requerido'
  }),
  estado:z.number({
    invalid_type_error:'El estado debe ser de tipo numérico.',
  }),
  nombre_serie:z.string({
    invalid_type_error:'El campo nombre de serie debe ser de tipo string',
    required_error:'El campo nombre de serie es requerido'
  }),
  caja:z.number({
    invalid_type_error:'El campo caja debe sere de tipo numérica',
    required_error:'El campo caja es requerido'
  }),
  estante:z.number({
    invalid_type_error:'El campo estante debe ser un numérico',
    required_error:'El campo estante es requerido'
  }),
  pasillo:z.string({
    invalid_type_error:'El campo pasillo debe ser de tipo String ',
    required_error:'El campo pasillo es requerido'
  }),
})


// VALIDA LOS DATOS CARGADOS DESDE EL EXCEL
const expedientSchemaXlsx = z.object({
  nombre:z.string({
    invalid_type_error:'El nombre expediente debe ser un String',
    required_error:'El expediente es requerido'
  }), 
  numero:z.string({
    invalid_type_error:'El número de expediente debe ser de tipo String',
    required_error:'El campo número de expediente es requerido'
  }),
  estado:z.boolean({
    invalid_type_error:'El estado debe ser de tipo booleano',
  }),
  nombre_serie:z.string({
    invalid_type_error:'El campo nombre de serie debe ser de tipo string',
    required_error:'El campo nombre de serie es requerido'
  }),
  caja:z.number({
    invalid_type_error:'El campo caja debe sere de tipo numérica',
    required_error:'El campo caja es requerido'
  }),
  estante:z.number({
    invalid_type_error:'El campo estante debe ser un numérico',
    required_error:'El campo estante es requerido'
  }),
  pasillo:z.string({
    invalid_type_error:'El campo pasillo debe ser un String',
    required_error:'El campo pasillo es requerido'
  }),
})



export function validateExpedientForm (input) {
  return expedientSchema.safeParse(input);
}
 export function validatePartialExpedientForm(input){
  return expedientSchema.partial().safeParse(input);
}

export function validateExpedient (input) {
  console.log('validando expediente')
  return expedientSchemaXlsx.safeParse(input);
}


 
