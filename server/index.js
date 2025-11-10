const express = require("express")
const cors = require("cors");
const { connectToDB } = require("./database/db.connection.js");

const dotenv = require("dotenv");
const router = require("./routes/admin.route.js");
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded())

app.use("/admin",router)

connectToDB().then(
app.listen(process.env.PORT,()=>{
    console.log(`server is listening on  http://localhost:${process.env.PORT}/ `)
})
)
