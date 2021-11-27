window.onload = init;

let tempComputation = 0; //store computation string
let computed = false; //indicator for each computation


function init() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].id === "all-clear") {
            buttons[i].onclick = allClear;
        } else if (buttons[i].id === "delete") {
            buttons[i].onclick = del;
        } else if (buttons[i].id === "percentage") {
            buttons[i].onclick = computePercentage;
        } else if (buttons[i].id === "equation") {
            buttons[i].onclick = computation;
        } else if (buttons[i].id === "decimal-point") {
            buttons[i].onclick = handleDecimalPoint;
        } else if (isNaN(buttons[i].value)) {
            buttons[i].onclick = handleOperators;
        } else {
            buttons[i].onclick = handleNumbers;
        }
    }
}


function handleNumbers() {
    const computationTag = document.getElementById("computation");
    const buttonValue = this.value;
    const buttonText = this.textContent;

    updateDisplay(buttonValue, computationTag);

    let lastButtonValue = tempComputation.toString().trimRight().slice(-1);

    if (tempComputation === 0) {
        computationTag.textContent = buttonText;
        tempComputation = buttonValue;
    } else {
        if (isNaN(lastButtonValue) && lastButtonValue !== ".") {
            computationTag.textContent += buttonText;
            tempComputation += buttonValue;
        } else {
            computationTag.textContent = computationTag.textContent.trimRight() + buttonText;
            tempComputation = tempComputation.toString().trimRight() + buttonValue;
        }      
    }
}


function handleOperators () {
    const computationTag = document.getElementById("computation");
    const buttonValue = this.value;
    const buttonText = this.textContent;

    updateDisplay(buttonValue, computationTag);

    let lastButtonValue = tempComputation.toString().trimRight().slice(-1);

    if (isNaN(lastButtonValue) && lastButtonValue !== ".") {
        computationTag.textContent = computationTag.textContent.trimRight().slice(0, -1) + (" " + buttonText + " ");
        tempComputation = tempComputation.toString().trimRight().slice(0, -1) + (" " + buttonValue + " ");
    } else {
        computationTag.textContent += (" " + buttonText + " ");
        tempComputation += (" " + buttonValue + " ");
    }
}


function handleDecimalPoint() {
    const computationTag = document.getElementById("computation");
    const buttonValue = this.value;
    const buttonText = this.textContent;

    updateDisplay(buttonValue, computationTag);

    let lastButtonValue = tempComputation.toString().trimRight().slice(-1);

    if (lastButtonValue !== buttonText) {
        computationTag.textContent += buttonText;
        tempComputation += buttonValue;
    }
}


function allClear() {
    const answerTag = document.getElementById("answer");
    const computationTag = document.getElementById("computation");

    answerTag.innerHTML = "";
    computationTag.innerHTML = 0;
    computed = false;  
    tempComputation = 0;
}


function del() {
    const computationTag = document.getElementById("computation");
    const currentComputationText = computationTag.textContent;
    
    if (computed === false) {
        if (tempComputation.toString().length === 1) {
            computationTag.innerHTML = 0;
            tempComputation = 0;
        } else {
            let newComputationText = currentComputationText.trimRight().slice(0, -1);
            computationTag.innerHTML = newComputationText;
            tempComputation = tempComputation.toString().trimRight().slice(0, -1);
        }  
    }
}


function computation() {
    const answerTag = document.getElementById("answer");
    const computationTag = document.getElementById("computation");
    
    let fractionalNumber = getFractionalNumber(tempComputation);
    let result = 0;

    if (fractionalNumber > 0) {
        result = parse(tempComputation).toFixed(fractionalNumber);
    } else {
        result = parse(tempComputation);
    }

    if (computed === false) {
        answerTag.innerHTML = computationTag.innerHTML + " = ";
        computationTag.innerHTML = result;
    }
    
    tempComputation = result;
    computed = true;

    
}


function parse(str) {
    return Function(`'use strict'; return (${str})`)()
}


function computePercentage() {
    const computationTag = document.getElementById("computation");
    let lastButtonValue = tempComputation.toString().trimRight().slice(-1);

    if (!isNaN(lastButtonValue) || lastButtonValue === '.') {
        computationTag.innerHTML += this.getAttribute("value");
        tempComputation += "/100";
        computation();
    } 
}


function updateDisplay(buttonValue, computationTag) {
    const answerTag = document.getElementById("answer");

    if (computed === true) {
        answerTag.textContent += tempComputation;
        computed = false;
        if (!isNaN(buttonValue) || buttonValue === ".") {
            tempComputation = 0;
            computationTag.textContent = 0;
        }
    }
}


function getFractionalNumber(tempComputation) {
    let numbersArray = tempComputation.toString().split(" ");
    let fractionalNumber = new Array;

    for (let i = 0; i < numbersArray.length; i++) {
        if (numbersArray[i].includes(".")) {
            fractionalArray = numbersArray[i].split(".");
            fractionalNumber.push(parseInt(fractionalArray[1].length));
        }  
    }

    return Math.max(...fractionalNumber);
}