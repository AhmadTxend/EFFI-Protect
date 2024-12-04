// Enum-like object for website keywords
const WebsiteEnum = {
    CHATGPT: 'chatgpt',
    GOOGLE: 'google',
    YAHOO: 'yahoo',
    COPILOT:'copilot',
    SODAPDF:'sodapdf',
    PDFTOTXT:'pdftotext'
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
        else if (hostname.includes(WebsiteEnum.PDFTOTXT)) {
            console.log('User visited PDFTOTXT website:', tab.url);
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
