const loadingTextArray = [
    "----------",
    ">---------",
    "]>--------",
    "_]>-------",
    ">_]>------",
    "[>_]>-----",
    "<[>_]>----",
    "-<[>_]>---",
    "--<[>_]>--",
    "---<[>_]>-",
    "----<[>_]>",
    "-----<[>_]",
    "------<[>_",
    "-------<[>",
    "--------<[",
    "---------<",
    "----------",

];

const loadingDiv = document.querySelector(".loading");
const loadingText = document.querySelector(".loading-text");

let intervalId = null;
let loadingTextArrayIndex = 0;
intervalId = setInterval(() => {
    loadingText.innerHTML = loadingTextArray[loadingTextArrayIndex];
    loadingTextArrayIndex == loadingTextArray.length - 1
        ? (loadingTextArrayIndex = 0)
        : loadingTextArrayIndex+=1;
}, 100);

function stopLoading() {
    clearInterval(intervalId);
    loadingDiv.classList.add("stop")
}

export default stopLoading;