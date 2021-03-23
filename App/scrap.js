( async () => {
  let btnScrapSearch = document.getElementById('btnScrapSearch');

  btnScrapSearch.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const port = chrome.tabs.connect(tab.id);
    port.postMessage({action: 'scanning'});
  
    port.onMessage.addListener(function (response) {
      const {action} = response;

      if(action == 'endScan') {
        port.postMessage({action: 'scraping'})
      }
    });
  });
})();