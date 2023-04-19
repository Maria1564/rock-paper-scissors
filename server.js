const express = require("express")
const app = express()
const http = require("http").createServer(app) 
const io = require("socket.io")(http)
PORT = 3000

//Маршрут
app.get("/", (req, res)=>{
    
    res.sendFile(__dirname + "/index.html")
})

app.use(express.static(__dirname + "/"))

let totalClient
let totalReadied = 0
const arrNicknames = []
const arrSelectedElement = [] 
io.on("connection", (socket)=>{
    console.log("произошло подключение к серверу")
    socket.on("send request", (data)=>{
        totalClient = data
        // console.log(data)
        
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

    socket.on("ready", (data)=> {
        socket.broadcast.emit("ready player", `игрок ${data} готов начать игру`)
        totalReadied += 1

        arrNicknames.push(data)

        if(arrNicknames.length == 2){
            //////////////////!
            io.emit("total ready", {total: totalReadied, nicknames: arrNicknames})
            if(totalReadied == 2) totalReadied = 0
            arrNicknames.length = 0
        }
    })

    socket.on("selectedElem", (data)=>{
        arrSelectedElement.push(data)
        console.log(arrSelectedElement)
        if(arrSelectedElement.length == 2){
            io.emit("selectedElem", arrSelectedElement)
            arrSelectedElement.length = 0
        }else{
            io.to(socket.id).emit("selectedElem", "Ждём выбор второго игрока")
        }
    })

    socket.on("disconnect", ()=>{
        console.log(`${socket.id} вышел с сервера`)
    })
})



http.listen(PORT, ()=> console.log(`сервер начал работу ${PORT}`))