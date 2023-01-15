const arrItem = ['камень', 'ножницы', 'бумага']

// let i = Math.round(Math.random()*(arrItem.length - 1))
// console.log(i)
const blockEnter = document.querySelector(".enterGame")
const blockMain = document.querySelector(".main")

const btnEnter = document.querySelector(".btn-nickname")
const btnExit = document.querySelector(".btn-exit")

const listItems = document.querySelector(".list-items")

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
})
