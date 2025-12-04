
const EventEmitter = require("events")
const fs = require("fs")
const { buffer } = require("stream/consumers")
const event = new EventEmitter()
event.on("say hi",(value)=>{
    
    fs.appendFileSync("./hello.txt",`say Hi ${value.name}\n`)
})

event.once("say hi",(value)=>{ //will fire at once even emitted multiple time 
    fs.appendFileSync("./hello.txt",`say hi again ${value.name}\n`)
})
event.emit("say hi",{name:"Nitesh"})
const rs = fs.createReadStream("./hello.txt")
rs.on("open",()=>{
        console.log("file open")
})
rs.on("close",()=>{
        console.log("file close")
})
const ws = fs.createWriteStream("hello1.txt")
rs.pipe(ws)
rs.on("data",(buffer)=>{
    console.log("read",buffer,)
})
ws.on("data",(buffer)=>{
    console.log("write",buffer)
})
const ob={hi:"hi"}
const ob1={hi1:"hi1"}
console.log(Object.assign({},ob,ob1))