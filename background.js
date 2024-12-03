// Enum-like object for website keywords
// const WebsiteEnum = {
//     CHATGPT: 'chatgpt',
//     GOOGLE: 'google',
//     YAHOO: 'yahoo',
// };

// function captureKeyPresses(tabId, url) {
//     console.log("captureKeyPresses function injected");

//     let typedText = '';
//     let isCtrlA = false;

//     // Function to handle keydown event
//     function handleKeydown(event) {
//         const printableKeys = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]$/; // Including space
        
        
//         if (event.ctrlKey || event.altKey) {
//             // Handle Ctrl+A (select all)
//             if (event.key === 'a' && event.ctrlKey) {
//                 isCtrlA = true; // Set flag if Ctrl+A is pressed
//             }
//             return; // Don't capture any other key when Ctrl or Alt is pressed
//         }

//         if (event.key === ' ' || printableKeys.test(event.key)) {
//             if (isCtrlA) {
//                 typedText = ''; 
//                 isCtrlA = false; 
//             }
//             typedText += event.key; // Concatenate typed character
//         } 
//         else if (event.key === 'Backspace') {
//             if (isCtrlA) {
//                 // If Ctrl+A was pressed before, reset typedText on Backspace
//                 typedText = ''; // Clear typedText if Ctrl+A was pressed before
//                 isCtrlA = false; // Reset the flag
//             } else {
//                 typedText = typedText.slice(0, -1); // Remove the last character
//             }
//         }
    

//         // On pressing 'Enter', log the concatenated text
//         if (event.key === 'Enter' && typedText) {
//             const info = {
//                 tabId: tabId, // Passing tabId
//                 typedText: typedText, // User's typed text
//                 url: url, // Passing the URL of the current tab
//             };

//             // Log the object to console
//             console.log('Captured info:', info);
//             typedText = ''; // Reset after Enter is pressed
//         }
//     }

//     // Function to handle paste event
//     function handlePaste(event) {
//         // Delay to allow pasted content to be updated in the field
//         setTimeout(() => {
//             const activeElement = document.activeElement;
//             let pastedText = '';

//             // Check if the active element is an input or textarea
//             if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
//                 pastedText = activeElement.value; // Get the value after paste
//             } else if (activeElement.isContentEditable) {
//                 pastedText = activeElement.innerText; // For editable divs
//             }

//             // Log the pasted text
//             const info = {
//                 tabId: tabId, // Passing tabId
//                 typedText: pastedText, // User's pasted text
//                 url: url, // Passing the URL of the current tab
//             };

//             // Log the object to console
//             console.log('Captured pasted text:', info);
//         }, 0);
//     }

//     // Function to handle button clicks or form submission
//     function handleButtonClick(event) {
//         console.log("handleButtonClick.");
//         // Check if the clicked button is the one to send the text (e.g., send or search button)
//         const info = {
//             tabId: tabId,
//             typedText: typedText,  // Captured text
//             url: url,  // The URL of the current tab
//         };

//         console.log('Captured info:', info); // Log the info
//         typedText = '';  // Reset typedText after sending the message
//     }

//     // Listen for keydown events
//     document.addEventListener('keydown', handleKeydown);

//     // Event Delegation: Listen for clicks on buttons (e.g., send button, search icon)
//     document.body.addEventListener('click', (event) => {
//         console.log('Button click listener')
//         // Check if the clicked element is a button or submit input
//         if (event.target && (event.target.matches('button') || 
//                                 event.target.matches('input[type="button"]') || 
//                                 event.target.matches('input[type="submit"]'))) {
//             handleButtonClick(event);
//         }
//     });

//     // Event Delegation: Listen for form submissions
//     document.body.addEventListener('submit', (event) => {
//         console.log('Button click listener')
//         // Prevent the form from submitting and handle it as if the button was clicked
//         event.preventDefault();
//         handleButtonClick(event);
//     }, true);  // Use capturing phase to catch the submit event before it bubble

//     // Listen for paste events
//     document.addEventListener('paste', handlePaste);
// }

// // Listen for tab updates and check the URL
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === 'complete') {
//         const url = new URL(tab.url);

//         // Get the hostname and search query from the URL
//         const hostname = url.hostname.toLowerCase();
//         const query = url.searchParams.get('q');

//         // Check if the domain name matches any of the specified websites
//         if (hostname.includes(WebsiteEnum.CHATGPT)) {
//             console.log('User visited a ChatGPT website:', tab.url);
//             // Inject the script to capture key presses on ChatGPT
//             chrome.scripting.executeScript({
//                 target: { tabId: tabId },
//                 func: captureKeyPresses,
//                 args: [tabId, tab.url]  // Pass tabId and url as arguments to the function
//             });
//         } else if (hostname.includes(WebsiteEnum.GOOGLE)) {
//             console.log('User visited a Google website:', tab.url);
//         } else if (hostname.includes(WebsiteEnum.YAHOO)) {
//             console.log('User visited a Yahoo website:', tab.url);
//         }

//         // Check if the search query includes any of the specified keywords (e.g., ChatGPT, Google, Yahoo)
//         if (query) {
//             if (query.toLowerCase().includes(WebsiteEnum.CHATGPT)) {
//                 console.log('User search query contains ChatGPT:', query);
//             } else if (query.toLowerCase().includes(WebsiteEnum.GOOGLE)) {
//                 console.log('User search query contains Google:', query);
//             } else if (query.toLowerCase().includes(WebsiteEnum.YAHOO)) {
//                 console.log('User search query contains Yahoo:', query);
//             }
//         }
//     }
// });




// Enum-like object for website keywords
const WebsiteEnum = {
    CHATGPT: 'chatgpt',
    GOOGLE: 'google',
    YAHOO: 'yahoo',
};

// Listen for tab updates and check the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = new URL(tab.url);

        // Get the hostname and search query from the URL
        const hostname = url.hostname.toLowerCase();
        const query = url.searchParams.get('q');

        // Check if the domain matches any specified website
        if (hostname.includes(WebsiteEnum.CHATGPT)) {
            console.log('User visited ChatGPT website:', tab.url);
            // Inject the content script dynamically
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js'], // Content script to inject
            });

            chrome.tabs.sendMessage(tabId, { tabId, url });
        } else if (hostname.includes(WebsiteEnum.GOOGLE)) {
            console.log('User visited Google website:', tab.url);
        } else if (hostname.includes(WebsiteEnum.YAHOO)) {
            console.log('User visited Yahoo website:', tab.url);
        }

        // Check if the search query includes specific keywords
        if (query) {
            if (query.toLowerCase().includes(WebsiteEnum.CHATGPT)) {
                console.log('User search query contains ChatGPT:', query);
            } else if (query.toLowerCase().includes(WebsiteEnum.GOOGLE)) {
                console.log('User search query contains Google:', query);
            } else if (query.toLowerCase().includes(WebsiteEnum.YAHOO)) {
                console.log('User search query contains Yahoo:', query);
            }
        }
    }
});
