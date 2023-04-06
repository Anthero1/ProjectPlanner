var critInput = document.getElementsByClassName("critInput").item(0);

critInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      //event.preventDefault();
      // Trigger the button element with a click
      alert("You entered: "+ critInput.value);
    }
  })