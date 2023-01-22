const express = require("express")
const app = express()
const http = require("http").createServer(app) 
const io = require("socket.io")(http)

//Маршрут
app.get("/", (req, res)=>{
    
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static(__dirname + "/"))

let totalClient
io.on("connection", (socket)=>{
    console.log("произошло подключение к серверу")
    socket.on("send request", (data)=>{
        totalClient = data
        console.log(data)
        
        if (io.engine.clientsCount > totalClient) {
            io.to(socket.id).emit("dis", {mess:`мест уже не осталось, вы отключены от сервера`, status: true})
            
            socket.disconnect()
            console.log(`Disconnected ${socket.id}`)
           
            console.log("io.engine.clientsCount >> ", io.engine.clientsCount) //кол-во подключившихся 
            return
        }else {
            io.emit("conn game", {totalNow: io.engine.clientsCount})
            io.to(socket.id).emit("send connected", {mess:"Вы успешно подключены с серверу", })
        }
    })

    socket.on("disconnect", ()=>{
        console.log(`${socket.id} вышел с сервера`)
    })
})



http.listen(3000, ()=> console.log("сервер начал работу"))