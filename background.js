// Enum-like object for website keywords
const WebsiteEnum = {
    CHATGPT: 'chatgpt',
    GOOGLE: 'google',
    YAHOO: 'yahoo',
    COPILOT:'copilot',
    SODAPDF:'sodapdf'
};

// Listen for tab updates and check the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {

        const url = new URL(tab.url);
        // Get the hostname and search query from the URL
        const hostname = url.hostname.toLowerCase();
        const query = url.searchParams.get('q');

        // Check if the domain matches any specified website
        if (hostname.includes(WebsiteEnum.CHATGPT))
        {
            console.log('User visited ChatGPT website:', tab.url);
            // Inject the content script dynamically
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js'], // Content script to inject
            });
            chrome.tabs.sendMessage(tabId, { tabId, url });
        } 
        else if (hostname.includes(WebsiteEnum.SODAPDF)) {
            console.log('User visited sodapdf website:', tab.url);
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js'], // Content script to inject
            });
            chrome.tabs.sendMessage(tabId, { tabId, url });
        }
        else if (hostname.includes(WebsiteEnum.GOOGLE)) {
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



// chrome.webRequest.onHeadersReceived.addListener(
//     function (details) {
//         console.log('details::',details)
//         // if (details.url.includes('api.openai.com')) { // Adjust URL as per actual API
//             console.log('Response headers received from LLM:', details);
            
//             // If you need to make a separate request to fetch the body (for instance using fetch):
//             fetch(details.url, { method: 'GET' })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('LLM Response Body:', data);
//                     // Do something with the LLM response here
//                 })
//                 .catch(error => console.error('Error fetching LLM response body:', error));
//         // }
//     },
//     { 
//         urls: ["https://chatgpt.com/backend-api/conversation/*"],  // Adjust the URL
//         types: ["xmlhttprequest"]  // Filter for XHR requests only (you can adjust based on need)
//     },
//     ["responseHeaders"]  // Add this to capture response headers
// );
