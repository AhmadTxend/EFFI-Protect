console.log("background.js");


// Enum-like object for website keywords
const WebsiteEnum = {
    CHATGPT: 'chatgpt',
    GOOGLE: 'google',
    YAHOO: 'yahoo',
};

function captureKeyPresses(tabId, url) {
    console.log("captureKeyPresses function injected");
    let typedText = '';
    // Listen for keydown events
    document.addEventListener('keydown', function (event) {
        const activeElement = document.activeElement;

        const printableKeys = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/;
    
        if (event.key === ' ' || printableKeys.test(event.key))
        {
            typedText += event.key; // Concatenate typed character
        }
        else if (event.key === 'Backspace') {
            // On pressing 'Backspace', remove the last character from typed text
            typedText = typedText.slice(0, -1); // Remove the last character
        }

        // On pressing 'Enter', log the concatenated text
        if (event.key === 'Enter') {
            // console.log('User typed text: ', typedText);
            const info = {
                tabId: tabId, // Passing tabId
                typedText: typedText, // User's typed text
                url: url, // Passing the URL of the current tab
            };

            // Log the object to console
            console.log('Captured info:', info);
            typedText = '';
        }
    });
}

// Listen for tab updates and check the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const url = new URL(tab.url);

        // Get the hostname and search query from the URL
        const hostname = url.hostname.toLowerCase();
        const query = url.searchParams.get('q');

        // Check if the domain name matches any of the specified websites
        if (hostname.includes(WebsiteEnum.CHATGPT)) {
            console.log('User visited a ChatGPT website:', tab.url);
            // Inject the script to capture key presses on ChatGPT
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: captureKeyPresses,
                args: [tabId, tab.url]
            });
        } else if (hostname.includes(WebsiteEnum.GOOGLE)) {
            console.log('User visited a Google website:', tab.url);
        } else if (hostname.includes(WebsiteEnum.YAHOO)) {
            console.log('User visited a Yahoo website:', tab.url);
        }

        // Check if the search query includes any of the specified keywords (e.g., ChatGPT, Google, Yahoo)
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

