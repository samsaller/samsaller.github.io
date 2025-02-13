function handleNav() {
    if (window.scrollY) {
        document.getElementById("nav").classList.add("moved");
    } else {
        document.getElementById("nav").classList.remove("moved");
    }
}

window.addEventListener("scroll", (e) => {
    handleNav();
});
handleNav();

document.querySelector(".logo").style.width =
    document.querySelector(".left-nav").offsetWidth + "px";
window.addEventListener("resize", () => {
    document.querySelector(".logo").style.width =
        document.querySelector(".left-nav").offsetWidth + "px";
});
