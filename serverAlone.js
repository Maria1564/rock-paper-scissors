const express = require("express")
const app = express()
const http = require("http").createServer(app) 
const io = require("socket.io")(http)
PORT = 4000

//Маршрут
app.get("/", (req, res)=>{
    
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static(__dirname + "/"))


io.on("connection", (socket)=>{
    console.log("произошло подключение к серверу")
    

    socket.on("disconnect", ()=>{
        console.log(`${socket.id} вышел с сервера`)
    })
})



http.listen(PORT, ()=> console.log(`сервер начал работу ${PORT}`))