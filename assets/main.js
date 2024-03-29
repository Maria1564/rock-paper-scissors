const arrItem = ['камень', 'ножницы', 'бумага']
const socket = io()

// let i = Math.round(Math.random()*(arrItem.length - 1))
// console.log(i)
const blockEnter = document.querySelector(".enterGame")
const blockMain = document.querySelector(".main")
const blockTypeGame = document.querySelector(".type-game")
const blockWaiting = document.querySelector(".waiting")

const btnEnter = document.querySelector(".btn-nickname")
const btnExit = document.querySelector(".btn-exit")
const btnStart = document.querySelector(".btn-start")
const btnAgain = document.querySelector(".btn-again")
const btnOnlineGame = document.querySelector(".btn-online")
const btnOnePlayer = document.querySelector(".btn-one-player")

const result = document.querySelector(".main__result")
const listItems = document.querySelector(".list-items")

const scoreBot = document.querySelector(".main__score-bot")
const scoreYou = document.querySelector(".main__score-you")

btnAgain.style.display = "none"

if(window.location.href == 'http://localhost:4000/')   {
    blockTypeGame.style.display = "none"
    blockEnter.style.display = "flex"
}

arrItem.forEach((item)=>{
    let opt = document.createElement("option")
    opt.textContent = item
    listItems.append(opt)
})

btnOnlineGame.addEventListener("click", (e)=>{
    socket.emit("send request", 2)
    socket.on("send connected", (data)=> alert(data.mess))
    socket.on("conn game", (data)=> {
       if(data.totalNow == 2){
        blockTypeGame.style.display = "none"
        blockWaiting.style.display = "none"
        blockEnter.style.display = "flex"
       }else{
        blockTypeGame.style.display = "none"
        blockWaiting.style.display = "flex"
       }
    })

    socket.on("dis", (data)=>{
        alert(data.mess)
        if(data.status){
            btnOnlineGame.style.display = "none"
        }
    })

})

btnOnePlayer.addEventListener("click", (e)=>{
    window.location.href = "http://localhost:4000"
})

//! Если одиночная игра
if(window.location.href == 'http://localhost:4000/')   {
    btnEnter.addEventListener("click", (e)=>{
        let nick = validateNickname()
        console.log("nick >> ", nick)
        if(nick != ""){
            blockEnter.style.display = "none"

            document.body.style.backdropFilter = 'none';
            blockMain.style.display = "block"
            let title = document.querySelector(".title")
            // title.style.background = "var(--color-primary)"
            document.querySelector(".main__you").textContent = `${nick}  (вы)` //!
        }
    })
    
    
    btnStart.addEventListener("click", ()=>{
        let bot = choicesBot(arrItem)
        document.querySelector(".main__item-bot").textContent = bot
        let you = choicesYou()
        document.querySelector(".item-you").textContent = you
        
        check(bot, you)
        
        winnerOrLoser()
    })

    btnExit.addEventListener("click", exit)
}



//! Если онлайн игра
if(window.location.href == 'http://localhost:3000/') {
    btnEnter.addEventListener("click", (e)=>{
        
       
        if( validateNickname() != ""){
        let nickname = blockEnter.querySelector(".nickname").value
        socket.emit("ready", nickname)
        btnEnter.disabled = true 
        }
    })

    socket.on('ready player', (data)=>{
        alert(data)
    })


    socket.on('total ready', (data)=>{
        console.log(data.nicknames)
        if(data.total == 2){
            data.nicknames.forEach(nick =>{
                if(nick != blockEnter.querySelector(".nickname").value) {
                    document.querySelector(".main__bot").textContent = `${nick}`
                }else{
                    document.querySelector(".main__you").textContent = `${nick}`
                }
            })

            blockEnter.style.display = "none"
            document.body.style.backdropFilter = 'none';
            blockMain.style.display = "block"
            let title = document.querySelector(".title")
            // title.style.background = "#95a7e4"


        }
    })

    btnStart.addEventListener("click",()=>{
        let youSelect = choicesYou()
        document.querySelector(".item-you").textContent = youSelect
        console.log(youSelect)
        let dataSelect = []
        const nickname = document.querySelector(".main__you").textContent
        console.log(nickname)
        //данные о выбраном элементе и кто выбрал
        socket.emit("selectedElem", {
            player: nickname,
            select: youSelect,
        })
        btnStart.disabled = true

    })


    socket.on("selectedElem", (data)=>{
        if(typeof data == "string"){
            alert(data)
        }else{
            console.log(data)
            data.forEach(item=>{
                console.log(item.player)
                if(item.player == document.querySelector(".main__bot").textContent){
                    document.querySelector(".main__item-bot").textContent = item.select
                    bot = item.select
                }else{
                    document.querySelector(".item-you").textContent = item.select
                    you = item.select
                }
            })

            check(bot, you)

      
            winnerOrLoser()
          

            setTimeout(()=>{
                btnStart.disabled = false

                document.querySelector(".main__item-bot").textContent = "?"
                document.querySelector(".item-you").textContent = "?"
            }, 1000)

        }

    })


    btnExit.addEventListener("click",()=>{
        exit()
        socket.emit("exit")
    })

    socket.on("exit", text=>{
        alert(text)
        exit()
    })
}



function validateNickname() {
    let nick = document.querySelector(".nickname").value
    console.log(nick)
    if(nick.trim() == "")  {
        alert('Вы ничего не ввели')
        return ''
    }
    return nick
}
/*****************************************************************************/

function exit(){
    document.body.style.backdropFilter = "blur(4px)"
    console.log(document.body.style.backdropFilter = "blur(4px)")
    blockEnter.style.display = "flex"
    blockMain.style.display = "none"
    let title = document.querySelector(".title")
    // title.style.background = "inherit"
    document.querySelector(".main__item-bot").textContent = '?'
    document.querySelector(".item-you").textContent = '?' 
    result.textContent = ""
    scoreBot.textContent = 0
    scoreYou.textContent = 0
    btnStart.style.display = "block"
    btnAgain.style.display = "none"  
    btnEnter.disabled = false
}

function choicesBot(arr) {
    let i = Math.round(Math.random()*(arr.length - 1))
    return arr[i]
}

function choicesYou() {
    let item = listItems.value
    return item
}


function check(itemBot, itemYou) {
    
    if((itemBot == 'ножницы'&& itemYou == 'бумага') || (itemBot == 'камень'&& itemYou == 'ножницы') 
    || (itemBot == 'бумага'&& itemYou == 'камень') ) {
        scoreBot.textContent = parseInt(scoreBot.textContent) + 1
    }else if((itemBot == 'ножницы'&& itemYou == 'ножницы') || (itemBot == 'камень'&& itemYou == 'камень') 
    || (itemBot == 'бумага'&& itemYou == 'бумага')) {
        scoreBot.textContent = parseInt(scoreBot.textContent) + 1
        scoreYou.textContent = parseInt(scoreYou.textContent) + 1
    }else {
        scoreYou.textContent = parseInt(scoreYou.textContent) + 1
    }
}

function winnerOrLoser() {
    if(parseInt(scoreBot.textContent) == 3 || parseInt(scoreYou.textContent) == 3) {
        btnStart.style.display = "none"
        btnAgain.style.display = "block"
        if(parseInt(scoreBot.textContent) == 3 && parseInt(scoreYou.textContent) == 3) {
            result.textContent = 'Tie'
        }else if (parseInt(scoreYou.textContent) == 3){
            result.textContent = 'You`re a winner!'
        }else {
            result.textContent = 'You`re the loser!'
        }
    }
}

btnAgain.addEventListener("click", ()=>{
    document.querySelector(".main__item-bot").textContent = '?'
    document.querySelector(".item-you").textContent = '?'
    result.textContent = ""
    scoreBot.textContent = 0
    scoreYou.textContent = 0
    btnStart.style.display = "block"
    btnAgain.style.display = "none"
})