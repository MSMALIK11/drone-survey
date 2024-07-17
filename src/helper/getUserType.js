export const getUserType=(data)=>{
    if(!data) return null
    let type=""
    if(data.is_admin){
        type="Admin"
    }else if (data.is_owner){
        type="Owner"
    }else{
        type="Member"
    }

    return type

}