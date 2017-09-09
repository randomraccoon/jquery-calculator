//Contains the numbers and operators in the expression.
let keyStack = [];
//True when number is on screen that should be overwritten,
//like a calculator screen showing the result of last calculation
let evaluated = false;

//Once the calculator is in error mode, it can only be reset
//by clearing the screen.
let error = false;


$(document).ready(function() {
  displayScreen();

  $('.buttons span').click(function() {
    pressKey($(this).text());
  });

  $(document).keydown((ev) => {
    pressKey(event.key);
  });
});

function pressKey(key) {
  key = sanitizeInput(key);
  if (key.length !== 1) return;
  if (!$.isNumeric(key)
    && (!keyStack.length || !$.isNumeric(keyStack[keyStack.length - 1]))
  ) {
    error = true;
  }
  if (key === 'c') {
    keyStack = [];
  } else if (evaluated && $.isNumeric(key)) {
    keyStack = [key];
  } else if (key === '=') {
    evaluateExpression();
  } else if (keyStack.length || key !== '0') {
    keyStack.push(key);
  }
  if (key !== "=") {
    evaluated = false;
  }
  displayScreen();
}

function sanitizeInput(key) {
  key = key.toLowerCase();
  key = key === "escape" ? "c" : key;
  key = key === "enter" ? "=" : key;
  key = key === "÷" ? "/" : key;
  key = key === "x" ? "*" : key;
  key = key.replace(/[^0-9c+-=*/]/, "");
  return key;
}

function displayScreen() {
  if (!keyStack.length) {
    error = false;
  } else if (!$.isNumeric(keyStack[0])) {
    error = true;
  }

  if (error) {
    $('#screen').text("Error");
  } else if (!keyStack.length) {
    $('#screen').text("0");
  } else {
    $('#screen').text(keyStack.join(''));
  }
}

function evaluateExpression() {
  let exp = keyStack.join('');
  let args = exp.split(/[^0-9.]/).map(e => Number(e));
  let operators = exp.replace(/[0-9.]/g, "");

  while (operators.search(/[*/]/) > -1) {
    let i = operators.search(/[*/]/);
    let arg1 = args[i];
    let arg2 = args[i + 1];
    let product = operators[i] === '*' ? arg1 * arg2 : arg1 / arg2;
    args.splice(i, 2, product);
    operators = operators.slice(0, i) + operators.slice(i + 1);
  }

  while (args.length > 1) {
    let i = operators.search(/[+-]/);
    let arg1 = args[i];
    let arg2 = args[i + 1];
    let product = operators[i] === '+' ? arg1 + arg2 : arg1 - arg2;
    args.splice(i, 2, product);
    operators = operators.slice(0, i) + operators.slice(i + 1);
  }
  keyStack = [args[0]];
  evaluated = true;
}
