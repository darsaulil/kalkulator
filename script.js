const displayHistory = document.querySelector("#displayHistory");
const displayCurrent = document.querySelector("#displayCurrent");
const buttons = document.querySelectorAll(".btn");

let currentValue = "0";
let previousValue = null;
let selectedOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
	displayCurrent.textContent = currentValue;
}

function formatNumber(value) {
	return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));
}

function calculate(firstValue, operator, secondValue) {
	switch (operator) {
		case "+":
			return firstValue + secondValue;
		case "-":
			return firstValue - secondValue;
		case "*":
			return firstValue * secondValue;
		case "/":
			return secondValue === 0 ? null : firstValue / secondValue;
		default:
			return secondValue;
	}
}

function inputNumber(value) {
	if (shouldResetDisplay) {
		currentValue = value;
		shouldResetDisplay = false;
	} else {
		currentValue = currentValue === "0" ? value : currentValue + value;
	}

	updateDisplay();
}

function inputDecimal() {
	if (shouldResetDisplay) {
		currentValue = "0.";
		shouldResetDisplay = false;
	} else if (!currentValue.includes(".")) {
		currentValue += ".";
	}

	updateDisplay();
}

function chooseOperator(operator) {
	const numericValue = Number(currentValue);

	if (selectedOperator && !shouldResetDisplay) {
		const result = calculate(previousValue, selectedOperator, numericValue);

		if (result === null) {
			showError();
			return;
		}

		currentValue = formatNumber(result);
		previousValue = result;
		updateDisplay();
	} else {
		previousValue = numericValue;
	}

	selectedOperator = operator;
	shouldResetDisplay = true;
	displayHistory.textContent = `${currentValue} ${operator}`;
}

function showResult() {
	if (!selectedOperator || previousValue === null) {
		return;
	}

	const result = calculate(previousValue, selectedOperator, Number(currentValue));

	if (result === null) {
		showError();
		return;
	}

	displayHistory.textContent = `${previousValue} ${selectedOperator} ${currentValue} =`;
	currentValue = formatNumber(result);
	previousValue = null;
	selectedOperator = null;
	shouldResetDisplay = true;
	updateDisplay();
}

function deleteLast() {
	if (shouldResetDisplay) {
		return;
	}

	currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
	if (currentValue === "-") {
		currentValue = "0";
	}

	updateDisplay();
}

function showError() {
	currentValue = "Error";
	previousValue = null;
	selectedOperator = null;
	shouldResetDisplay = true;
	displayHistory.textContent = "Tidak dapat membagi dengan 0";
	updateDisplay();
}

function handleButton(value) {
	if (/^\d$/.test(value)) {
		inputNumber(value);
	} else if (value === ".") {
		inputDecimal();
	} else if (["+", "-", "*", "/"].includes(value)) {
		chooseOperator(value);
	} else if (value === "=") {
		showResult();
	} else if (value === "AC") {
		currentValue = "0";
		previousValue = null;
		selectedOperator = null;
		shouldResetDisplay = false;
		displayHistory.textContent = "";
		updateDisplay();
	} else if (value === "DEL") {
		deleteLast();
	} else if (value === "%") {
		currentValue = formatNumber(Number(currentValue) / 100);
		updateDisplay();
	}
}

buttons.forEach((button) => {
	button.addEventListener("click", () => handleButton(button.textContent.trim()));
});

document.addEventListener("keydown", (event) => {
	const key = event.key;

	if (/^\d$/.test(key) || [".", "+", "-", "*", "/", "%", "=", "Enter", "Backspace", "Escape"].includes(key)) {
		event.preventDefault();
	}

	if (/^\d$/.test(key)) {
		handleButton(key);
	} else if (key === "Enter" || key === "=") {
		handleButton("=");
	} else if (key === "Backspace") {
		handleButton("DEL");
	} else if (key === "Escape") {
		handleButton("AC");
	} else if (key === "%") {
		handleButton("%");
	} else {
		handleButton(key);
	}
});