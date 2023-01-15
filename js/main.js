const arrItem = ['камень', 'ножницы', 'бумага']

// let i = Math.round(Math.random()*(arrItem.length - 1))
// console.log(i)
const blockEnter = document.querySelector(".enterGame")
const blockMain = document.querySelector(".main")

const btnEnter = document.querySelector(".btn-nickname")
const btnExit = document.querySelector(".btn-exit")
const btnStart = document.querySelector(".btn-start")
const btnAgain = document.querySelector(".btn-again")

const result = document.querySelector(".main__result")
const listItems = document.querySelector(".list-items")

const scoreBot = document.querySelector(".main__score-bot")
const scoreYou = document.querySelector(".main__score-you")

btnAgain.style.display = "none"

arrItem.forEach((item)=>{
    let opt = document.createElement("option")
    opt.textContent = item
    listItems.append(opt)
})

function validateNickname() {
    let nick = document.querySelector(".nickname").value
    if(nick.trim() == ""){
        alert('Вы ничего не ввели')
    }else{
        blockEnter.style.display = "none"
        blockMain.style.display = "block"
        let title = document.querySelector(".title")
        title.style.background = "#95a7e4"
        document.querySelector(".main__you").textContent = `${nick}  (вы)` //!
    }
}

btnEnter.addEventListener("click", validateNickname)

btnExit.addEventListener("click", ()=>{
    blockEnter.style.display = "flex"
    blockMain.style.display = "none"
    let title = document.querySelector(".title")
    title.style.background = "inherit"
    document.querySelector(".main__item-bot").textContent = '?'
    document.querySelector(".item-you").textContent = '?'
    result.textContent = ""
    scoreBot.textContent = 0
    scoreYou.textContent = 0
    btnStart.style.display = "block"
    btnAgain.style.display = "none"
})


function choicesBot(arr) {
    let i = Math.round(Math.random()*(arr.length - 1))
    return arr[i]
}

function choicesYou() {
    let item = listItems.value
    return item
}

btnStart.addEventListener("click", ()=>{
    let bot = choicesBot(arrItem)
    document.querySelector(".main__item-bot").textContent = bot
    let you = choicesYou()
    document.querySelector(".item-you").textContent = you
    check(bot, you)
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
})

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

btnAgain.addEventListener("click", ()=>{
    document.querySelector(".main__item-bot").textContent = '?'
    document.querySelector(".item-you").textContent = '?'
    result.textContent = ""
    scoreBot.textContent = 0
    scoreYou.textContent = 0
    btnStart.style.display = "block"
    btnAgain.style.display = "none"
})