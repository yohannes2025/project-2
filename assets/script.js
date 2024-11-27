// Initialize variables to store the current display and result display state
let currentDisplay = "0"; // The current display content
let resultDisplay = false; // Flag to track whether the result is displayed

// Function to append a value to the current display
function appendToDisplay(value) {
  if (currentDisplay === "0" || resultDisplay) {
    // If the current display is "0" or the result is already displayed, replace it with the new value
    currentDisplay = value;
  } else {
    // Otherwise, concatenate the new value to the current display
    currentDisplay += value;
  }

  // Reset the result display flag to false, as the user entered a new value
  resultDisplay = false;

  // Update the calculator display to show the new content
  updateDisplay();
}

// Function to update the calculator display with the current content
function updateDisplay() {
  const displayElement = document.getElementById("display");
  displayElement.textContent = currentDisplay;
}
