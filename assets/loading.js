const loadingjs = ()=>{

    let loadingTextArray = []
    
    
    const loadingDiv = document.querySelector(".loading");
    const loadingText = document.querySelector(".loading-text");
    const loadingPercentage = document.querySelector(".loading-percentage");
    const versionby = document.querySelector(".versionby").innerHTML
    const loadingError = document.querySelector(".loading-error")
    const trainTexts = [
        "  ><>  ",
        "  |_|>  ",
        "  LOL  ",
        ">  <",
        "...",
        "  ^-^  ",
        "  ><>  ",
        "  |_|>  ",
        ">  <",
        "...",
        "  ^-^  ",
        "  IS  ",
        "  EVERYTHING  ",
        "  OKAY  ",
        "  ???  ",
    
    ]
    const railText = "-"
    loadingTextArray.push(railText.repeat(versionby.length))
    
    for (let j = 0; j<trainTexts.length; j++) {
        let result = ""
        let trainText = trainTexts[j];
        for(let i = 1; i < versionby.length+trainText.length; i++){
            let a = trainText.slice(-i)
            let b = i-trainText.length
            result=railText.repeat(b > 0 ? b : 0)+a
            if(result.length <= versionby.length){
                result += railText.repeat(versionby.length-result.length)
            }else{
                result = result.slice(0,versionby.length)
            }
            loadingTextArray.push(result)
        }
    }
    
    let loadingTextArrayIndex = 0;
    const intervalId = setInterval(() => {
        loadingText.textContent = loadingTextArray[loadingTextArrayIndex];
        loadingTextArrayIndex == loadingTextArray.length - 1
            ? (loadingTextArrayIndex = 0)
            : loadingTextArrayIndex+=1;
    }, 75);
    
    
    
    const stopLoading = (stopLoadingAllowed)=>{
        if(stopLoadingAllowed){
            loadingPercentage.innerHTML = "100%"
            loadingDiv.classList.add("stop")
            setTimeout(() => {
                clearInterval(intervalId);
            }, 1000);
        }
    }
    console.log("Loading initialized")
    return {stopLoading, loadingPercentage, loadingError}
}


export default loadingjs