const wait = (milliseconds) => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, milliseconds);
    });
};

const createPopup = () => {
    const styleDiv = "position: fixed;z-index: 2000;width:100%; top: 0px;left: 0px;overflow: visible;display: flex;align-items: flex-end;background-color: lightgray;font-size: 10px;padding: 10px;";
    const stylePre = "position: relative;max-height: 400px;overflow: scroll;width: 100%;"
    const div = document.createElement('div')
    div.id = "krowdy-message"
    div.style = styleDiv

    const pre = document.createElement('pre')
    pre.id = "krowdy-pre"
    pre.style = stylePre

    const button = document.createElement('button')

    button.id = "krowdy-button"
    button.style = "background: gray;border: 2px solid;padding: 8px;"
    button.innerText = "Aceptar"

    const bodyElement = document.querySelector('div.body')

    bodyElement.appendChild(div)

    pre.innerText = "Estamos extrayendo la información!!!!"
    div.appendChild(pre)
    div.appendChild(button)
    return { div, pre, button }
}

const scrapingProfile = async () => {
    //Utils
    const autoscrollToElement = async function (cssSelector) {
        console.log('autoscrollToElement', cssSelector);
        var exists = document.querySelector(cssSelector);

        while (exists) {
            //
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY

            //if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
            if (maxScrollTop >= (currentScrollTop + 20) || elementScrollTop <= currentScrollTop)
                break;

            await wait(32)

            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
            window.scrollTo(0, newScrollTop)
        }

        console.log('finish autoscroll to element %s', cssSelector);

        return new Promise(function (resolve) {
            resolve();
        });
    };

    //Logic
    const selectorProfile = {
        personalInformation: {
            name: "div.ph5.pb5 > div.display-flex.mt2 ul li",
            title: "div.ph5.pb5 > div.display-flex.mt2 h2",
            resume: 'section.pv-about-section > p'
        },
        experienceInformation: {
            list: '#experience-section > ul > li',
            groupByCompany: {
                identify: '.pv-entity__position-group',
                company: 'div.pv-entity__company-summary-info > h3 > span:nth-child(2)',
                list: 'section > ul > li',
                title: 'div > div > div > div > div > div > h3 > span:nth-child(2)',
                date: 'div > div > div > div > div > div > div > h4 > span:nth-child(2)',
                description: '.pv-entity__description'
            },
            default: {
                title: 'section > div > div > a > div.pv-entity__summary-info > h3',
                company: 'section > div > div > a > div.pv-entity__summary-info > p.pv-entity__secondary-title',
                date: 'section > div > div > a > div.pv-entity__summary-info > div > h4.pv-entity__date-range > span:nth-child(2)',
                description: 'section > div > div > div > p'
            }
        },
        educationInformation: {
            list: '#education-section > ul > li',
            institution: 'div > div > a > div.pv-entity__summary-info > div > h3',
            career: 'div > div > a > div.pv-entity__summary-info > div > p > span:nth-child(2)',
            date: 'div > div > a > div.pv-entity__summary-info > p > span:nth-child(2)'
        }
    }

    const clickOnMoreResume = async () => {
        const elementMoreResume = document.getElementById('line-clamp-show-more-button')
        if (elementMoreResume) elementMoreResume.click()
    }

    const getPersonalInformation = async () => {
        const { personalInformation: selector } = selectorProfile
        const elementNameProfile = document.querySelector(selector.name)
        const elementNameTitle = document.querySelector(selector.title)
        const elementResume = document.querySelector(selector.resume)

        const name = elementNameProfile?.innerText
        const title = elementNameTitle?.innerText
        const resume = elementResume?.innerText
        return { name, title, resume }
    }

    const getExperienceInformation = async () => {
        const { experienceInformation: selector } = selectorProfile
        //get information
        let experiencesRawList = document.querySelectorAll(selector.list)
        let experiencesRawArray = Array.from(experiencesRawList)

        const groupCompaniesList = experiencesRawArray.filter(el => {
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)
            return groupCompanyExperience.length > 0
        })

        const uniqueExperienceList = experiencesRawArray.filter(el => {
            let groupCompanyExperience = el.querySelectorAll(selector.groupByCompany.identify)
            return groupCompanyExperience.length == 0
        })

        const experiences = uniqueExperienceList.map(el => {
            const title = el.querySelector(selector.default.title)?.innerText
            const date = el.querySelector(selector.default.date)?.innerText
            const company = el.querySelector(selector.default.company)?.innerText
            const description = el.querySelector(selector.default.description)?.innerText

            return { title, date, company, description }
        })

        for (let i = 0; i < groupCompaniesList.length; i++) {
            const item = groupCompaniesList[i]
            const company = item.querySelector(selector.groupByCompany.company)?.innerText
            const itemsCompanyGroupList = item.querySelectorAll(selector.groupByCompany.list)
            const itemsCompanyGroupArray = Array.from(itemsCompanyGroupList)

            const experiencesData = itemsCompanyGroupArray.map(el => {
                const title = el.querySelector(selector.groupByCompany.title)?.innerText
                const date = el.querySelector(selector.groupByCompany.date)?.innerText
                const description = el.querySelector(selector.groupByCompany.description)?.innerText

                return { title, date, company, description }
            })

            experiences.push(...experiencesData)
        }

        return experiences
    }

    const getEducationInformation = async () => {
        const { educationInformation: selector } = selectorProfile
        const educationItems = document.querySelectorAll(selector.list)
        const educationArray = Array.from(educationItems)
        const educations = educationArray.map(el => {
            const institution = el.querySelector(selector.institution)?.innerText
            const career = el.querySelector(selector.career)?.innerText
            const date = el.querySelector(selector.date)?.innerText
            return { institution, career, date }
        })
        return educations
    }

    const addProfile = function(profile){
        let existingProfiles = JSON.parse(localStorage.getItem('profileListData'))
        if(existingProfiles == null) existingProfiles = []
        existingProfiles.push(profile)
        console.log(existingProfiles)
        localStorage.setItem('profileListData', JSON.stringify(existingProfiles))
    }

    //Scroll to all information
    await autoscrollToElement('body')
    await clickOnMoreResume()

    //Scraping Complete Profile
    const personalInformation = await getPersonalInformation()
    const experienceInformation = await getExperienceInformation()
    const educationInformation = await getEducationInformation()

    await wait(1000)

    //Setting data to send information
    const profile = { ...personalInformation, experiences: experienceInformation, educations: educationInformation }
    addProfile(profile)
}

const scrapingSearchList = async () => {
    const selectorSearchList = {
        searchList: {
            itemList: ".reusable-search__result-container",
            itemLink: ".entity-result__item div div a"
        }
    }

    const extensionListener = function (message, sender, sendResponse) {

        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name == "init") {
            connections[message.tabId] = port;
            return;
        }
    }

    const searchListItems = document.querySelectorAll(selectorSearchList.searchList.itemList)
    const searchList = Array.from(searchListItems)
    const profiles = searchList.map(el => {
        const linkElement = el.querySelector(selectorSearchList.searchList.itemLink).href
        return { linkElement }
    })

    console.log('scrapingSearchList ', profiles);
    chrome.runtime.sendMessage({ "message": "openUriProfile", "url": profiles });
}

window.onload = async function () {
    const executeScrap = localStorage.getItem('executeScrap')
    const indexProfileUrl = localStorage.getItem('indexProfileUrl')
    const arrProfiles = JSON.parse(localStorage.getItem('profileUrl'))

    if (executeScrap == 'true') {
        localStorage.setItem('executeScrap', false)
        await wait(3000)
        await scrapingProfile()

        if (arrProfiles && arrProfiles.length > parseInt(indexProfileUrl) + 1) 
            chrome.runtime.sendMessage({ "message": "openUriProfile", "url": arrProfiles, "index": parseInt(indexProfileUrl) + 1 });
        else {
            const { div, pre, button } = createPopup()
            profileListData = JSON.parse(localStorage.getItem('profileListData'))
            pre.innerText = JSON.stringify(profileListData, null, 2)
            button.addEventListener("click", () => {
                div.remove()
            })
        }
    }

};

//Comunication
(function () {
    chrome.runtime.onConnect.addListener(async function (port) {
        port.onMessage.addListener(async function (msg) {
            const { action, profiles, index } = msg

            switch(action){
                case "scrapingList":
                    localStorage.clear()
                    scrapingSearchList()
                    break
                case "scraping":
                    localStorage.setItem('profileUrl', JSON.stringify(profiles))
                    localStorage.setItem('executeScrap', true)
                    localStorage.setItem('indexProfileUrl', index)
                
                    document.location.href = profiles[index].linkElement
                    break
            }
        });
    })
})();