window.onload = init;

let tempComputation = 0; //store computation string
let computed = false; //indicator for each computation
let lastButton = ""; //store last button value
let lastNumber = ""; //store last number to verify decimal point
let maxDecimalPoint = 0; //store max fraction part to round up to that point
let currentDecimalPoint = 0; //fraction part of current decimal number
let decimalPoint = false; //decimal point indicator
let result = 0;

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
        } else if (buttons[i].id === "change") {
            buttons[i].onclick = change;
        } else {
            buttons[i].onclick = handleButton;
        }
    }
}


function handleButton() {
    const computationTag = document.getElementById("computation");
    const buttonValue = this.getAttribute("value");

    updateDisplay(buttonValue, computationTag);
    computed = false;

    if (!isNaN(buttonValue) && tempComputation === 0) {
        if (buttonValue !== "0") {
            computationTag.innerHTML = this.textContent;
            tempComputation = buttonValue;
        }   
    } else if (!isNaN(buttonValue) && tempComputation !== 0) {
        computationTag.innerHTML += this.textContent;
        tempComputation += buttonValue;
    } else if (isNaN(buttonValue) && tempComputation === 0) {
        computationTag.innerHTML += this.textContent;
        tempComputation += buttonValue;
    } else if (isNaN(buttonValue) && tempComputation !== 0) {
        if (buttonValue === ".") {
            if (lastButton === "." || lastNumber.includes(".")) {}
            else {
                computationTag.innerHTML += this.textContent;
                tempComputation += buttonValue;
            }            
        } else if (buttonValue !== ".") {
            lastNumber = "";
            if (isNaN(lastButton)) {
                if (lastButton !== ".") {
                    computationTag.innerHTML = computationTag.innerHTML.slice(0, -3) + this.textContent;
                    tempComputation = tempComputation.slice(0, -1) + buttonValue;
                } else {
                    computationTag.innerHTML += this.textContent;
                    tempComputation += buttonValue;
                }
            } else {
                computationTag.innerHTML += this.textContent;
                tempComputation += buttonValue;
            }
        }
    } 
    
    if (decimalPoint === true) {
        if (!isNaN(buttonValue)){
            currentDecimalPoint += 1;
        } else {
            maxDecimalPoint = Math.max(maxDecimalPoint, currentDecimalPoint);
            currentDecimalPoint = 0;
            decimalPoint = false;
        }
    }

    maxDecimalPoint = Math.max(maxDecimalPoint, currentDecimalPoint);

    if (buttonValue === ".") {
        decimalPoint = true;
    }

    console.log(decimalPoint, currentDecimalPoint, maxDecimalPoint);


    lastButton = buttonValue;
    lastNumber += buttonValue;
}


function allClear() {
    const answerTag = document.getElementById("answer");
    const computationTag = document.getElementById("computation");

    answerTag.innerHTML = "";
    computationTag.innerHTML = 0;
    computed = false;  
    tempComputation = 0;
    lastNumber = "";
    lastButton = "";
    maxDecimalPoint = 0;
    currentDecimalPoint = 0;
    decimalPoint = false;
}


function del() {
    const computationTag = document.getElementById("computation");
    const currentComputationText = computationTag.textContent;
    
    if (computed === false) {
        if (tempComputation.toString().length === 1) {
            computationTag.innerHTML = 0;
            tempComputation = 0;
            decimalPoint = false;
            maxDecimalPoint = 0;
            currentDecimalPoint = 0;
            lastButton = "";
            lastNumber = "";
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

    if (maxDecimalPoint !== 0) {
        result = parse(tempComputation).toFixed(maxDecimalPoint);
    } else {
        result = parse(tempComputation);
    }

    answerTag.innerHTML = computationTag.innerHTML + " = ";
    computationTag.innerHTML = result;

    tempComputation = result;
    computed = true;
}


function parse(str) {
    return Function(`'use strict'; return (${str})`)()
}



function change() {

}


function computePercentage() {
    const computationTag = document.getElementById("computation");
    console.log(lastButton);
    if (isNaN(lastButton) && lastButton !== '.') {}
    else {
        computationTag.innerHTML += this.getAttribute("value");
        tempComputation += "/100";
        computation();
    } 
}


function updateDisplay(buttonValue, computationTag) {
    const answerTag = document.getElementById("answer");

    if (computed === true) {
        answerTag.textContent += tempComputation;
        if (!isNaN(buttonValue) || buttonValue === ".") {
            tempComputation = 0;
            computationTag.textContent = 0;
        }
    }
}