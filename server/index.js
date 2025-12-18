const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const { connectToDB } = require("./database/db.connection.js");

const dotenv = require("dotenv");
const adminRouter = require("./routes/admin.route.js");
const empRouter = require("./routes/employee.route.js");
dotenv.config()
const app = express();
app.use(cors({
    origin:["https://taskflow-app-rose.vercel.app", 
        "http://localhost:5173"],
    credentials:true
}));
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())

app.use("/admin",adminRouter)
app.use("/employee",empRouter)

connectToDB().then(
app.listen(process.env.PORT,()=>{
    console.log(`server is listening on  http://localhost:${process.env.PORT}/ `)
})
)
