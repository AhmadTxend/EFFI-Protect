
console.log("Content script loaded");

// Function to capture key presses
function captureInput(tabId, url) {

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
      if (event.key === 'Enter' && !event.shiftKey && typedText) {
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
    const button = event.target.closest('button[aria-label="Send prompt"]');
    const AttachmentButton = event.target.closest('button[aria-label="Attach files"]');
    
    if (button && (button.matches('button') || 
                    button.matches('input[type="button"]') || 
                    button.matches('input[type="submit"]'))) {
        handleButtonClick(event);
    }
    if (AttachmentButton) {
        console.log('Attachment button clicked:', button);
    }
  });

  document.addEventListener('change', function(event) {
        if (event.target && event.target.type === 'file') {
            const files = event.target.files; // Files uploaded by the user
            
            // Loop through all selected files (though typically only one file is selected)
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Ensure the file is a text file
                if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    
                    // Define the onload event to handle the file content once it's read
                    reader.onload = function(e) {
                        const fileContent = e.target.result; // File content as a string
                        console.log('Captured file content:', fileContent);
                    };

                    // Read the file as text
                    reader.readAsText(file);
                } else {
                    console.log('Not a text file:', file.name);
                }
            }
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

function captureResponse() {

    console.log("capture response called.");

    const originalFetch = window.fetch;
    console.log("originalFetch:",originalFetch);

    window.fetch = function(url, options) {
        
        // Check if the request is to the LLM API endpoint
        if (url.includes("https://chatgpt.com/backend-api/conversation/")) {
            console.log("Captured request to LLM API:", url, options);
        }

        // Call the original fetch and capture the response
        return originalFetch(url, options).then(response => {
            // Check if the response is from the desired endpoint
            if (response.url.includes("https://chatgpt.com/backend-api/conversation/")) {
                console.log('Captured response from LLM API:', response);

                // Clone the response to consume the body
                response.clone().json().then(data => {
                    console.log('LLM Response Body:', data);
                    // Do something with the LLM response here
                }).catch(error => {
                    console.error('Error capturing response body:', error);
                });
            }

            // Always return the original response so the page can continue processing
            return response;
        }).catch(error => {
            console.error('Fetch error:', error);
            throw error; // Rethrow to ensure the page functions properly
        });
    };
}


// Function to process uploaded files
function processUploadedFile(file) {
    const fileType = file.type;

    if (fileType === "text/plain") {
        // Handle text file
        const reader = new FileReader();
        reader.onload = function(event) {
            const textContent = event.target.result;
            console.log("Text file content:", textContent);

            // Do something with the extracted text
        };
        reader.readAsText(file);
    } else if (fileType === "application/pdf") {
        // Handle PDF file using PDF.js
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;

            // Use PDF.js to extract text from the PDF
            pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(pdf => {
                let text = "";
                const numPages = pdf.numPages;

                const pagePromises = [];
                for (let i = 1; i <= numPages; i++) {
                    pagePromises.push(
                        pdf.getPage(i).then(page => {
                            return page.getTextContent().then(content => {
                                const pageText = content.items.map(item => item.str).join(" ");
                                text += pageText + "\n";
                            });
                        })
                    );
                }

                Promise.all(pagePromises).then(() => {
                    console.log("PDF file content:", text);

                    // Do something with the extracted text
                });
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        console.error("Unsupported file type:", fileType);
    }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
    
    if (window.listenersInitialized) {
        console.log("Listeners already initialized. Skipping re-initialization.");
        return;
    }
    window.listenersInitialized = true; // Mark that listeners have been added

    if (message.tabId && message.url) {
        // Call captureKeyPresses with the arguments
        captureInput(message.tabId, message.url);
        // captureResponse();
    }
});






  