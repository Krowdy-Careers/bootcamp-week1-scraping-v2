const btnscanprofile = document.getElementById('btnscanprofile');

btnscanprofile.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const port = chrome.tabs.connect(tab.id);
    console.log('connected ', port);
    port.postMessage({acction: 'scanning'});
  });