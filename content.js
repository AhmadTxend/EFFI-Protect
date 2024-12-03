
console.log("Content script loaded");
// Function to capture key presses
function captureKeyPresses(tabId, url) {

  console.log("captureKeyPresses function injected");
  let typedText = '';
  let isCtrlA = false;

  // Function to handle keydown event
  function handleKeydown(event) {
      const printableKeys = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]$/; // Including space
      
      
      if (event.ctrlKey || event.altKey) {
          // Handle Ctrl+A (select all)
          if (event.key === 'a' && event.ctrlKey) {
              isCtrlA = true; // Set flag if Ctrl+A is pressed
          }
        // Handle Ctrl + Backspace
        if (event.key === 'Backspace' && event.ctrlKey) {
          typedText = ''; // Clear typedText when Ctrl + Backspace is pressed
        }

          return; // Don't capture any other key when Ctrl or Alt is pressed
      }

      if (event.key === ' ' || printableKeys.test(event.key)) {
          if (isCtrlA) {
              typedText = ''; 
              isCtrlA = false; 
          }
          typedText += event.key; // Concatenate typed character
      } 
      else if (event.key === 'Backspace') {
          if (isCtrlA) {
              // If Ctrl+A was pressed before, reset typedText on Backspace
              typedText = ''; // Clear typedText if Ctrl+A was pressed before
              isCtrlA = false; // Reset the flag
          } else {
              typedText = typedText.slice(0, -1); // Remove the last character
          }
      }
  

      // On pressing 'Enter', log the concatenated text
      if (event.key === 'Enter' && typedText) {
          const info = {
              tabId: tabId, // Passing tabId
              typedText: typedText, // User's typed text
              url: url, // Passing the URL of the current tab
          };

          // Log the object to console
          console.log('Captured info:', info);
          typedText = ''; // Reset after Enter is pressed
      }
  }

  // Function to handle paste event
  function handlePaste(event) {
      // Delay to allow pasted content to be updated in the field
      setTimeout(() => {
          const activeElement = document.activeElement;
          let pastedText = '';

          // Check if the active element is an input or textarea
          if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
              pastedText = activeElement.value; // Get the value after paste
          } else if (activeElement.isContentEditable) {
              pastedText = activeElement.innerText; // For editable divs
          }

          // Log the pasted text
          const info = {
              tabId: tabId, // Passing tabId
              typedText: pastedText, // User's pasted text
              url: url, // Passing the URL of the current tab
          };

          // Log the object to console
          console.log('Captured pasted text:', info);
      }, 0);
  }

  // Function to handle button clicks or form submission
  function handleButtonClick(event) {
      console.log("handleButtonClick.");
      // Check if the clicked button is the one to send the text (e.g., send or search button)
      const info = {
          tabId: tabId,
          typedText: typedText,  // Captured text
          url: url,  // The URL of the current tab
      };

      console.log('Captured info:', info); // Log the info
      typedText = '';  // Reset typedText after sending the message
  }

  // Listen for keydown events
  document.addEventListener('keydown', handleKeydown);

  // Event Delegation: Listen for clicks on buttons (e.g., send button, search icon)
  document.body.addEventListener('click', (event) => {
   // Check if the clicked element is a button or a submit input, regardless of child elements like SVG
    const button = event.target.closest('button');
    if (button && (button.matches('button') || 
                    button.matches('input[type="button"]') || 
                    button.matches('input[type="submit"]'))) {
        handleButtonClick(event);
    }
  });

  document.body.addEventListener('submit', (event) => {
      console.log('Button click listener')
      // Prevent the form from submitting and handle it as if the button was clicked
      event.preventDefault();
      handleButtonClick(event);
  }, true);  // Use capturing phase to catch the submit event before it bubble

  // Listen for paste events
  document.addEventListener('paste', handlePaste);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.tabId && message.url) {
      // Call captureKeyPresses with the arguments
      captureKeyPresses(message.tabId, message.url);
  }
});