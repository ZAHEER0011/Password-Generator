const inputSlider = document.querySelector("[data-passwordSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const upperCaseCheck = document.querySelector("#uppercase-check");
const lowerCaseCheck = document.querySelector("#lowercase-check");
const numbersCheck = document.querySelector("#numbers-check");
const symbolsCheck = document.querySelector("#symbols-check");
const indicator = document.querySelector("[data-passwordIndicator]");
const generateButton = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+-={}"|:?><[]\';/.,`';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Set Strength Circle to grey.



// Set Password Length
function handleSlider(){

    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    


}

function setIndicator(color){
    indicator.style.background = color;
    indicator.style.boxShadow = `0px 0px 15px 5px ${color}`; // More blur & spread for a glowing effect
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperrCase(){
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied!";
    } catch (error) {
        copyMsg.innerText = "failed!";
    }
    copyMsg.classList.add("active");
    setTimeout (() => {
        copyMsg.classList.remove("active");
    },2000);
    
}

function shufflePassword(array){
    //Fisher Yates Method

    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+= el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })

    //Special Condition;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateButton.addEventListener('click', () => {
    //None of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //Let's start the journey to find the new password

    console.log("Starting the Journey");

    //remove existing password

    password = "";

    // Let's put the stuff mentioned by checkboxes

    // if(upperCaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generatelowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperrCase)
    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase)
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber)
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol)

    //Compulsory Addition

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //Remaining Addition

    for(let i=0; i<passwordLength-funcArr.length; i++ ){
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //Shuffle the password

    password = shufflePassword(Array.from(password));

    //Show in UI

    passwordDisplay.value = password;

    //Calculate Strength

    calcStrength()
})