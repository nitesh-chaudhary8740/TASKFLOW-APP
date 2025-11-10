const mongoose = require("mongoose")
// const dotenv = require("dotenv")
// dotenv.config()
const connectToDB = async () =>{
    try {
        const connection = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log("db connected successfulyy",connection.connection.host)
    } catch (error) {
        console.log(error)
        throw new Error("failed to connect to database")
    }
}
module.exports = {connectToDB}
