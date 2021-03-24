//var global
let lastLink = 0
let listCandidates = []
let cantPag = 0;
const scrapingPagination = async() => {
    
    const waitScrapingPagination =  async (milliseconds) => {
        await new Promise((resolve) => {
            setTimeout(resolve, milliseconds)
        })
    }

    const autoscrollToElement = async function(cssSelector){
    
        let exists = document.querySelector(cssSelector);
    
        while(exists){
            //
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY
    
    
            if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break;
    
            await waitScrapingPagination(10)
    
            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
            window.scrollTo(0,newScrollTop)
        }
    
        console.log('finish autoscroll to element %s', cssSelector);
    
        return new Promise(function(resolve){
            resolve();
        });
    };

    await autoscrollToElement('body')
    const items = document.querySelectorAll('.artdeco-pagination__indicator.artdeco-pagination__indicator--number span')
    //Setting data to send information
    await waitScrapingPagination(10);
    const number = items[items.length-1].innerText
    return number
}

const scrapingList = async (number) => {
    //Utils
    const waitScrapingList = (milliseconds)=>{
        return new Promise(function(resolve){
            setTimeout(function() {
                resolve()
            }, milliseconds)
        })
    }
    
    const gotoNext = async () => {
        let initialLink = window.location.search
        if(document.getElementsByClassName('artdeco-pagination__button artdeco-pagination__button--next artdeco-button artdeco-button--muted artdeco-button--icon-right artdeco-button--1 artdeco-button--tertiary ember-view').length && !document.getElementsByClassName('artdeco-pagination__button artdeco-pagination__button--next artdeco-button artdeco-button--muted artdeco-button--icon-right artdeco-button--1 artdeco-button--tertiary ember-view')[0].disabled){
            let nextButton = document.getElementsByClassName('artdeco-pagination__button artdeco-pagination__button--next artdeco-button artdeco-button--muted artdeco-button--icon-right artdeco-button--1 artdeco-button--tertiary ember-view')[0]
            nextButton.click()
            let counter = 0
            let timer = setInterval(function (){
                if(window.location.search != initialLink){
                    clearInterval(timer)
                    listProfile()
                }
                else counter++
            }, 1)
        }
        else {
            // alert("All done!")
        }
    }

    const listProfile = async () => {
        if(cantPag == number) {
            let results = document.getElementsByClassName('reusable-search__result-container')
            if(lastLink >= results.length-1){
                lastLink = -1
                cantPag++;
                gotoNext()
            }
            else{
                if(results[lastLink]){
                    for(let i = 0; i <results.length; i++) {
                        let a = results[lastLink].getElementsByClassName('app-aware-link')[0]
                        await waitScrapingList(10)
                        listCandidates.push(a.href)
                        lastLink++
                        await autoscrollToElementInit('body')
                    }
                }
            }
        }
    }
    await waitScrapingList(10)
    listProfile()
    return listCandidates
}

const scrapingProfile = async ()=>{
    //Utils
    const waitScrapingProfile = (milliseconds)=>{
        return new Promise(function(resolve){
            setTimeout(function() {
                resolve()
            }, milliseconds)
        })
    }

    const autoscrollToElement = async function(cssSelector){
    
        let exists = document.querySelector(cssSelector);
    
        while(exists){
            //
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY
    
    
            if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break;
    
            await waitScrapingPagination(10)
    
            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
            window.scrollTo(0,newScrollTop)
        }
    
        console.log('finish autoscroll to element %s', cssSelector);
    
        return new Promise(function(resolve){
            resolve();
        });
    };

    const selectorProfile = {
        personalInformation:{
            name:"div.ph5.pb5 > div.display-flex.mt2 ul li",
            title:"div.ph5.pb5 > div.display-flex.mt2 h2",
            resume: 'section.pv-about-section > p'
        },
        experienceInformation:{
            list : '#experience-section > ul > li',
            groupByCompany:{
                identify:'.pv-entity__position-group',
                company: 'div.pv-entity__company-summary-info > h3 > span:nth-child(2)',
                list: 'section > ul > li',
                title: 'div > div > div > div > div > div > h3 > span:nth-child(2)',
                date:'div > div > div > div > div > div > div > h4 > span:nth-child(2)',
                description: '.pv-entity__description'
            },
            default:{
                title: 'section > div > div > a > div.pv-entity__summary-info > h3',
                company:'section > div > div > a > div.pv-entity__summary-info > p.pv-entity__secondary-title',
                date: 'section > div > div > a > div.pv-entity__summary-info > div > h4.pv-entity__date-range > span:nth-child(2)',
                description: 'section > div > div > div > p'
            }
        },
        educationInformation:{
            list: '#education-section > ul > li',
            institution :'div > div > a > div.pv-entity__summary-info > div > h3',
            career : 'div > div > a > div.pv-entity__summary-info > div > p > span:nth-child(2)',
            date : 'div > div > a > div.pv-entity__summary-info > p > span:nth-child(2)'
        }
    }

    const clickOnMoreResume = async ()=>{
        const elementMoreResume = document.getElementById('line-clamp-show-more-button')
        if(elementMoreResume) elementMoreResume.click()
    }

    const getPersonalInformation = async ()=>{
        const {personalInformation:selector} = selectorProfile
        const elementNameProfile = document.querySelector(selector.name)
        const elementNameTitle = document.querySelector(selector.title)
        const elementResume = document.querySelector(selector.resume)
        
        const name = elementNameProfile?.innerText
        const title = elementNameTitle?.innerText
        const resume = elementResume?.innerText
        return {name,title,resume}
    }

    const getExperienceInformation = async ()=>{
        const {experienceInformation:selector} = selectorProfile
        //get information
        let experiencesRawList = document.querySelectorAll(selector.list)
        let experiencesRawArray = Array.from(experiencesRawList)

        const groupCompaniesList = experiencesRawArray.filter(el=>{
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)  
            return groupCompanyExperience.length >0
        })

        const uniqueExperienceList = experiencesRawArray.filter(el=>{
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)  
            return groupCompanyExperience.length ==0
        })
        
        const experiences = uniqueExperienceList.map(el=>{
            const title = el.querySelector(selector.default.title)?.innerText
            const date = el.querySelector(selector.default.date)?.innerText
            const company = el.querySelector(selector.default.company)?.innerText
            const description = el.querySelector(selector.default.description)?.innerText
            
            return {title,date,company,description}
        })

        for(let i = 0; i< groupCompaniesList.length; i++){
            const item = groupCompaniesList[i]
            const company = item.querySelector(selector.groupByCompany.company)?.innerText
            const itemsCompanyGroupList = item.querySelectorAll(selector.groupByCompany.list)
            const itemsCompanyGroupArray = Array.from(itemsCompanyGroupList)

            const experiencesData = itemsCompanyGroupArray.map(el=>{
                const title = el.querySelector(selector.groupByCompany.title)?.innerText
                const date = el.querySelector(selector.groupByCompany.date)?.innerText
                const description = el.querySelector(selector.groupByCompany.description)?.innerText
                
                return {title,date,company,description}
            })

            experiences.push(...experiencesData)
        }

        return experiences
    }

    const getEducationInformation = async ()=>{
        const {educationInformation:selector} = selectorProfile
        const educationItems = document.querySelectorAll(selector.list)
        const educationArray = Array.from(educationItems)
        const educations = educationArray.map(el=>{
            const institution = el.querySelector(selector.institution)?.innerText
            const career = el.querySelector(selector.career)?.innerText
            const date = el.querySelector(selector.date)?.innerText
            return {institution,career,date}
        })
        return educations
    }

    await autoscrollToElement('body')
    await clickOnMoreResume()
    
    //Scraping Complete Profile
    const personalInformation =  await getPersonalInformation()
    const experienceInformation = await getExperienceInformation()
    const educationInformation = await getEducationInformation()
    
    await waitScrapingProfile(10)

    //Setting data to send information
    const profile = {...personalInformation, experiences:experienceInformation, educations:educationInformation }
    
    return profile
}

//Comunication
(function(){
    console.log("entrando nuevamente")
    chrome.runtime.onConnect.addListener((port) => {
        port.onMessage.addListener(function(msg) {
          const { acction } = msg
          if(acction == "scrapingPagination") {
            scrapingPagination().then(result => {
                port.postMessage({action: 'endPagination', number: result})
            })
          }
          
          else if (acction == "scrapingList"){ 
            scrapingList().then(result => {
                port.postMessage({action: 'endPaginationList', listCandidates: result, index})
            })
          } 
      
          else if (acction == "scrapingList"){ 
                scrapingList().then(result => {
                port.postMessage({action: 'endListProfile', listCandidates: result})
            })
          } 
          else if(acction == "scrapingProfile"){
            const { index } = msg
            scrapingProfile().then(result => {
                port.postMessage({action: 'endProfile', profile: result, index})
            })
          } 
          else if(acction =='show candidates')
          {
              showInformation(profile);
          }
        })
})})()
