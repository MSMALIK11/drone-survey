export const getUserType=(data)=>{
    if(!data) return null
    let type=""
    if(data.is_admin && data.is_owner){
        type="Owner"
    }else if (data.is_owner){
        type="Owner"
    }else if(data.is_admin ){
        type="Admin"
    }
    else{
        type="Member"
    }

    return type

}