document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("calc-display");
  const buttons = document.getElementsByClassName("btn");
  const angleModeElements = document.getElementsByName("angleMode");

  let currentValue = ""; // Current value being entered
  let lastResult = ""; // Stores the last calculated result
  let angleMode = "degree"; // Default angle mode
  let memoryValue = 0; // Variable to store memory value

  // Function to calculate factorial
  function factorial(n) {
    n = Number(n);
    if (n < 0) throw new Error("Factorial Error: Negative number");
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  // Function to delete the last character from input
  function deleteLast() {
    if (currentValue.length > 0) {
      currentValue = currentValue.slice(0, -1);
      display.value = currentValue || "0";
    }
  }

  // Function to convert angles based on the selected mode
  function convertAngle(value) {
    if (angleMode === "degree") return (value * Math.PI) / 180; // Convert degrees to radians
    return value; // Radians (no conversion needed)
  }

  // Memory functions
  function memoryAdd() {
    const value = parseFloat(currentValue || "0");
    memoryValue += value;
  }

  function memorySubtract() {
    const value = parseFloat(currentValue || "0");
    memoryValue -= value;
  }

  function memoryRecall() {
    currentValue = memoryValue.toString();
    display.value = currentValue;
  }

  function memoryClear() {
    memoryValue = 0;
  }

  // Function to evaluate the expression and update the display
  function evaluateResult() {
    try {
      let convertedValue = currentValue
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "*0.01")
        .replace(
          /sin\(([^)]+)\)/g,
          (match, p1) => `Math.sin(${convertAngle(evaluateExpression(p1))})`
        )
        .replace(
          /cos\(([^)]+)\)/g,
          (match, p1) => `Math.cos(${convertAngle(evaluateExpression(p1))})`
        )
        .replace(
          /tan\(([^)]+)\)/g,
          (match, p1) => `Math.tan(${convertAngle(evaluateExpression(p1))})`
        )
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/log\(([^)]+)\)/g, "Math.log10($1)") // Base-10 logarithm
        .replace(/\^/g, "**") // Power operator
        .replace(/sqrt\(([^)]+)\)/g, (match, p1) => {
          const arg = Number(evaluateExpression(p1));
          if (arg < 0) throw new Error("Square Root Error: Negative number");
          return `Math.sqrt(${arg})`;
        });

      // Handle ln (natural logarithm)
      convertedValue = convertedValue.replace(/ln\(([^)]+)\)/g, (match, p1) => {
        const arg = Number(evaluateExpression(p1));
        if (arg <= 0)
          throw new Error("Natural Logarithm Error: Non-positive number");
        return Math.log(arg);
      });

      // Handle memory operations
      convertedValue = convertedValue
        .replace(/M\+/g, () => {
          memoryAdd();
          return memoryValue.toString();
        })
        .replace(/M\-/g, () => {
          memorySubtract();
          return memoryValue.toString();
        })
        .replace(/MR/g, () => {
          return memoryValue.toString();
        })
        .replace(/MC/g, () => {
          memoryClear();
          return "0";
        });

      // Handle factorial
      convertedValue = convertedValue.replace(/(\d+)!/g, (match, number) => {
        return factorial(number);
      });

      // Handle Rand (random number)
      convertedValue = convertedValue.replace(
        /Rand/g,
        Math.random().toString()
      );

      console.log("Converted Expression: ", convertedValue);

      // Safely evaluate the mathematical expression
      const result = evaluateExpression(convertedValue);
      if (isNaN(result)) throw new Error("Calculation Error: Invalid result");
      lastResult = result.toString(); // Store the result
      currentValue = lastResult; // Update current value
      display.value = lastResult; // Display result

      // Clear the workspace after the calculation
      resetWorkspace();
    } catch (error) {
      console.error(error);
      display.value = "ERROR: " + error.message;
      currentValue = "";
    }
  }

  // Helper function to evaluate a mathematical expression
  function evaluateExpression(expression) {
    return new Function("return " + expression)();
  }

  // Reset workspace to initial state
  function resetWorkspace() {
    currentValue = ""; // Clear the current value
    angleMode = "degree"; // Reset the angle mode to the default
    for (let i = 0; i < angleModeElements.length; i++) {
      angleModeElements[i].checked = angleModeElements[i].value === "degree";
    }
    console.log("Workspace has been reset.");
  }

  // Event listener for all buttons
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener("click", function () {
      const value = button.dataset.value;

      if (value === "AC") {
        currentValue = "";
        display.value = "0";
      } else if (value === "=") {
        evaluateResult();
      } else if (value === "⌫") {
        deleteLast();
      } else if (value === "M+") {
        memoryAdd();
        display.value = "Memory Added";
      } else if (value === "M-") {
        memorySubtract();
        display.value = "Memory Subtracted";
      } else if (value === "MR") {
        memoryRecall();
      } else if (value === "MC") {
        memoryClear();
        display.value = "Memory Cleared";
      } else {
        if (
          ["+", "-", "×", "÷", "^", ".", "%"].includes(value) &&
          currentValue === ""
        ) {
          return; // Prevent invalid leading operators
        }
        currentValue += value;
        display.value = currentValue;
      }
    });
  }

  // Event listener for angle mode toggle
  for (let i = 0; i < angleModeElements.length; i++) {
    angleModeElements[i].addEventListener("change", function (event) {
      angleMode = event.target.value;
      console.log("Angle Mode: ", angleMode);
    });
  }

  // Keyboard input handling
  document.addEventListener("keydown", function (event) {
    const keyMap = {
      0: "0",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9",
      "+": "+",
      "-": "-",
      "*": "×",
      "/": "÷",
      ".": ".",
      "(": "(",
      ")": ")",
      "^": "^",
      Enter: "=",
      Backspace: "⌫",
      Escape: "AC",
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      const value = keyMap[event.key];

      if (value === "AC") {
        currentValue = "";
        display.value = "0";
      } else if (value === "=") {
        evaluateResult();
      } else if (value === "⌫") {
        deleteLast();
      } else {
        if (
          ["+", "-", "×", "÷", "^", ".", "%"].includes(value) &&
          currentValue === ""
        ) {
          return; // Prevent invalid leading operators
        }
        currentValue += value;
        display.value = currentValue;
      }
    }
  });
});
