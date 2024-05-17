
export async function getUsersController(req,res) {
  try {
      const getUsers = await getUsersService()
      if(!getUsers){
        return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
      }
      return getUsers
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
  }
}

export async function createUserController(req,res) {
  const{name,email,password,rol} = req.body
  if(!(name && email && password && rol)){
    return res.status(400).json({message:"Los datos son incompletos, verifica la información e intenta de nuevo."})
  }

  try {
    const data = {name,email,password,rol}
    const newUser = await createUserService(data);

    if(!newUser){
      return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
    }

    return res.status(200).json({message:'Usuario creado exitosamente.'});
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'Ocurrio un error inesperado en el servidor, intenta de nuevo mas tarde.'});
  }
} 