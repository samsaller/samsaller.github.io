const loadingjs = () => {
    let loadingTextArray = [];

    const loadingDiv = document.querySelector(".loading");
    const loadingText = document.querySelector(".loading-text");
    const loadingPercentage = document.querySelector(".loading-percentage");
    var loadingPercentageValue = 0;
    const versionby = document.querySelector(".versionby").innerHTML;
    const loadingError = document.querySelector(".loading-error");
    const trainTexts = [
        "  <><  ",
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
    ];
    const railText = "-";
    loadingTextArray.push(railText.repeat(versionby.length));

    for (let j = 0; j < trainTexts.length; j++) {
        let result = "";
        let trainText = trainTexts[j];
        for (let i = versionby.length + trainText.length; i >= 1; i--) {
            let a = trainText.slice(-i);
            let b = i - trainText.length;
            result = railText.repeat(b > 0 ? b : 0) + a;
            if (result.length <= versionby.length) {
                result += railText.repeat(versionby.length - result.length);
            } else {
                result = result.slice(0, versionby.length);
            }
            loadingTextArray.push(result);
        }
    }

    let loadingTextArrayIndex = 0;
    const intervalId = setInterval(() => {
        loadingText.textContent = loadingTextArray[loadingTextArrayIndex];
        loadingTextArrayIndex == loadingTextArray.length - 1
            ? (loadingTextArrayIndex = 0)
            : (loadingTextArrayIndex += 1);
    }, 75);

    let animationFrame;
    function animateChange(start, end, duration, todo) {
        let startTime = performance.now();

        function update(currentTime) {
            let elapsed = Math.abs(currentTime - startTime);
            let progress = Math.min(elapsed / duration, 1);
            let value = start + (end - start) * progress;
            value = Math.floor(value);
            todo(value);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update);
            }
        }
        if (end - start != 1) {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(update);
        } else {
            console.log(end, "I dont remember when i get this log :/");
            todo(end);
        }
    }
    const percentageSet = (newValue) => {
        animateChange(loadingPercentageValue, newValue, 500, (value)=>{
            loadingPercentageValue = value
            loadingPercentage.innerHTML = loadingPercentageValue + "%";
        })
    };

    const stopLoading = (stopLoadingAllowed) => {
        if (stopLoadingAllowed) {
            loadingPercentage.innerHTML = "100%";
            loadingDiv.classList.add("stop");
            setTimeout(() => {
                clearInterval(intervalId);
            }, 500);
        }
    };
    console.log("Loading initialized");
    return { stopLoading, loadingPercentage, percentageSet, loadingError };
};

export default loadingjs;
