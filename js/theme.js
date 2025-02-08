const themeLink = document.getElementById("theme")

function changeTip(){
    let tipCHanged = false
    return function changeTipText(){
        let tipText = document.getElementById("tipText")
        if(!tipCHanged){
            tipText.innerText = "This website made by Sam"
            tipCHanged = !tipCHanged
        }
    }
}

let changeTipText = changeTip()
var currentTheme = "dark"

window.addEventListener("click", (e) => {
    if(currentTheme === "dark") {
        document.body.classList.add("light-theme")
        currentTheme = "light"
    }else {
        document.body.classList.remove("light-theme")
        currentTheme = "dark"
    }
    changeTipText()
})