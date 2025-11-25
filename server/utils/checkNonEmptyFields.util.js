
export const checkForEmptyFieldsInReqBody = (req)=>{
    for (const key in req.body) {
            if(req.body[key].trim()==="")
                {
                    return true
                }    
    }
    return false
}