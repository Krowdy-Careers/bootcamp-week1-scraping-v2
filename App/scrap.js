let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    var port = chrome.tabs.connect(tab.id);    
    port.postMessage({action: 'scrapingList'});
})

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.message === "openUriProfile") {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            var port = chrome.tabs.connect(tab.id);

            if (!request.index) request.index = 0
            port.postMessage({ action: 'scraping', profiles: request.url, index: request.index });
        }
    }
);

