import bcrypt from 'bcrypt'

export async function encryptPass(pass) {
  try {
    const hashPass =  bcrypt.hash(pass, 10)
    return hashPass
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function decryptPass(pass,hasPass) {
  try {
    const hashPass =  bcrypt.compare(pass, hasPass)
    return hashPass
  } catch (error) {
    console.log(error)
    return null
  }
}