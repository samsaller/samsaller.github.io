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

window.addEventListener("click", (e) => {
    let currentTheme = themeLink.getAttribute("href")
    if(currentTheme === "./css/theme-dark.css") {
        themeLink.setAttribute("href", "./css/theme-light.css")
    }else {
        themeLink.setAttribute("href", "./css/theme-dark.css")
    }
    changeTipText()
})