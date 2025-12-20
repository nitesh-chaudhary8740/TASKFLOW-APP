const generateUserPassword = (length)=>{
let password=""
const charStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ124567890*%@*%$##"
for (let index = 0; index < length; index++) {
    password += charStr.charAt(Math.floor(Math.random()*charStr.length))
    
}
return password
}
module.exports = generateUserPassword