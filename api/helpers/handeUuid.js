import {v4 as idV4} from 'uuid'

export async function getuuid(){
 const newId =   idV4();
 return(newId)
}



