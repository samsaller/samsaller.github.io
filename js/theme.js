const themeLink = document.getElementById("theme");

var currentTheme = "";

const themeChangedEvent = new CustomEvent("themeChange", {
    detail: {
        theme: currentTheme,
    },
});

function changeTheme(dark) {
    if (currentTheme === "dark" || dark === false) {
        document.body.classList.add("light-theme");
        document.getElementById("theme-switcher").innerHTML="Dark"
        currentTheme = "light";
        document.dispatchEvent(themeChangedEvent);
    } else {
        document.body.classList.remove("light-theme");
        document.getElementById("theme-switcher").innerHTML="Light"
        currentTheme = "dark";
        document.dispatchEvent(themeChangedEvent);
    }
}

if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    changeTheme(true);
} else {
    changeTheme(false);
}
