const btnscrap = document.getElementById('btnscrap');

btnscrap.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const port = chrome.tabs.connect(tab.id);
    console.log('connected ', port);
    port.postMessage({acction: 'scrapingPagination'})
    let number = 0
    let listCandidates = []
    port.onMessage.addListener(function(response) {
      if(response.action =="endPagination") {
        number = parseInt(response?.number)
        if(number && number>0)
          port.postMessage({acction:'scrapingListPagination', listCandidates: listCandidates, index:0})
      }
      else if(response.action =='endPaginationList'){
        let {listCandidates, index} = response
        if(index < number){
          port.postMessage({acction:'scrapingList', listCandidates: listCandidates,index:index+1})
        }
      }
      else if(response.action =="endListProfile") {
        listCandidates = response?.listCandidates
        if(listCandidates&&listCandidates.length>0)
          port.postMessage({acction:'scrapingProfile', url:listCandidates[0], index:0})
      }
      else if(response.action =='endProfile'){
        const {profile, index} = response
        if(index < listCandidates.length){
         listCandidates[index].profile = profile 
          port.postMessage({acction:'scrapingProfile', url:listCandidates[index+1], index:index+1})
        }
        else {
          port.postMessage({acction:'show candidates'}, listCandidates)
        }
      }
    })
  });