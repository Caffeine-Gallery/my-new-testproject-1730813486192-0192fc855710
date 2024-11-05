import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let currentValue = '';
let operator = '';
let waitingForSecondOperand = false;

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

window.appendToDisplay = function(value) {
    if (waitingForSecondOperand) {
        display.value = value;
        waitingForSecondOperand = false;
    } else {
        display.value += value;
    }
    currentValue = display.value;
};

window.clearDisplay = function() {
    display.value = '';
    currentValue = '';
    operator = '';
    waitingForSecondOperand = false;
};

window.setOperation = function(op) {
    if (currentValue !== '') {
        operator = op;
        waitingForSecondOperand = true;
    }
};

window.calculate = async function() {
    if (operator && currentValue !== '') {
        const secondOperand = parseFloat(currentValue);
        const firstOperand = parseFloat(display.value);
        let result;

        showLoader();

        try {
            switch (operator) {
                case '+':
                    result = await backend.add(firstOperand, secondOperand);
                    break;
                case '-':
                    result = await backend.subtract(firstOperand, secondOperand);
                    break;
                case '*':
                    result = await backend.multiply(firstOperand, secondOperand);
                    break;
                case '/':
                    const divisionResult = await backend.divide(firstOperand, secondOperand);
                    result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                    break;
            }

            display.value = result;
            currentValue = result.toString();
            operator = '';
            waitingForSecondOperand = false;
        } catch (error) {
            console.error('Error during calculation:', error);
            display.value = 'Error';
        } finally {
            hideLoader();
        }
    }
};
