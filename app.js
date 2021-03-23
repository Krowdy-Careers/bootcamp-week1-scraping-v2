const wait = function (milliseconds) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, milliseconds);
    });
};

const autoScroll = async (scrollTo) => {

    const exists = document.querySelector(scrollTo);

    while(exists) {
        let maxScrollTop = document.body.clientHeight - window.innerHeight;
        let elementScrollTop = document.querySelector(scrollTo).offsetHeight;
        let currentScrollTop = window.scrollY;

        if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
        break;
            
        await wait(32);

        let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
        window.scrollTo(0, newScrollTop);
    }

    return new Promise(function(resolve) {
        resolve();
    });
}

const scrapingProfile = async () => {

    const clickOnMoreResume = async () => {
        const elementMoreResume = document.getElementById("line-clamp-show-more-button");

        if (elementMoreResume) {
        elementMoreResume.click();
        }
    }

    const getPersonalInformation = async () => {
        try {
            const name = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul li")?.innerText;
            const title = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 h2")?.innerText;
            const location = document.querySelector("ul.pv-top-card--list-bullet > li")?.innerText;
            const resume = document.querySelector("section.pv-about-section > p")?.innerText;
            
            return { name, title, location, resume }
        } catch (error) {
            throw error;
        }
    }

    const clickOnMoreExperience = async () => {
        const elementMoreExperience = document.querySelector("section.experience-section > div.pv-experience-section__see-more > button.pv-profile-section__see-more-inline");

        if(elementMoreExperience) {
            elementMoreExperience.click();
        }
    }
    
    const getExperienceInformation = async () => {
        try {
            const elementAllExperience = document.querySelectorAll("ul.pv-profile-section__section-info > li > section");
            const experienceArray = Array.from(elementAllExperience);
    
            const experienceData = experienceArray.map((experienceItem) => {
                const elementPositionGroup = experienceItem.querySelector("ul.pv-entity__position-group");
    
                const getMultipleRoles = (experienceItem) => {
                    const elementPositionInfo = experienceItem.querySelector("div > a");
    
                    const companyName = elementPositionInfo.querySelector("div.pv-entity__company-summary-info > h3 > span:nth-child(2)")?.innerText;
                    const companyTotalDuration = elementPositionInfo.querySelector("div.pv-entity__company-summary-info > h4 > span:nth-child(2)")?.innerText;
    
                    const elementAllCompaniesPosition = elementPositionGroup.querySelectorAll("li.pv-entity__position-group-role-item");
                    const experienceArray = Array.from(elementAllCompaniesPosition);
    
                    const positionRolesList = experienceArray.map((roleItem) => {
                        const elementRoleContainer = roleItem.querySelector("div.pv-entity__role-container > div");
                        const roleName = elementRoleContainer.querySelector("div.pv-entity__summary-info-v2 > h3 > span:nth-child(2)")?.innerText;
                        const roleWorkday = elementRoleContainer.querySelector("div.pv-entity__summary-info-v2 > h4")?.innerText;
                        const employmentDate = elementRoleContainer.querySelector("div.pv-entity__summary-info-v2 > div > h4 > span:nth-child(2)")?.innerText;
                        const employmentDuration = elementRoleContainer.querySelector("div.pv-entity__summary-info-v2 > div > h4:nth-child(2) > span:nth-child(2)")?.innerText;
                        const roleLocation = elementRoleContainer.querySelector("div.pv-entity__summary-info-v2 > h4.pv-entity__location > span:nth-child(2)")?.innerText;
                        const roleDetails = elementRoleContainer.querySelector("div.pv-entity__extra-details > p")?.innerText;
    
                        return ({ roleName, roleWorkday, employmentDate, employmentDuration, roleLocation, roleDetails })
                    });
                    
                    return ({ companyName, companyTotalDuration, companyRoles: { ...positionRolesList}})
                }
    
                const getIndividualRole = (experienceItem) => {
                    const elementPositionInfo = experienceItem.querySelector("div > div");
                    const roleName = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > h3")?.innerText;
                    const companyName = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > p.pv-entity__secondary-title")?.innerText;
                    const roleWorkday = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > p.pv-entity__secondary-title > span.pv-entity__secondary-title")?.innerText;
                    const employmentDate = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > div > h4.pv-entity__date-range > span:nth-child(2)")?.innerText;
                    const employmentDuration = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > div > h4:nth-child(2) > span:nth-child(2)")?.innerText;
                    const roleLocation = elementPositionInfo.querySelector("a > div.pv-entity__summary-info > h4.pv-entity__location > span:nth-child(2)")?.innerText;
                    const roleDetails = elementPositionInfo.querySelector("div.pv-entity__extra-details > p")?.innerText;
                    
                    return ({ roleName, companyName, roleWorkday, employmentDate, employmentDuration, roleLocation, roleDetails });
                }
    
                if(elementPositionGroup) {
                    return (getMultipleRoles(experienceItem))
                } else {
                    return (getIndividualRole(experienceItem))
                }
            });
            
            return { ...experienceData }
        } catch (error) {
            throw error
        }
    }

    const clickOnMoreEducation = async () => {
        const elementMoreEducation = document.querySelector("section.education-section > div.pv-profile-section__actions-inline > button.pv-profile-section__see-more-inline");

        if(elementMoreEducation) {
            elementMoreEducation.click();
        }
    }

    const getEducationInformation = async () => {
        try {
            const elementAllEducation = document.querySelectorAll("section#education-section > ul.pv-profile-section__section-info > li");
            const educationArray = Array.from(elementAllEducation);
    
            const educationList = educationArray.map((educationItem) => {
                const schoolName = educationItem.querySelector("div.pv-entity__degree-info > h3")?.innerText;
                const degreeName = educationItem.querySelector("div.pv-entity__summary-info > div.pv-entity__degree-info > p.pv-entity__degree-name > span:nth-child(2)")?.innerText;
                const disciplineName = educationItem.querySelector("div.pv-entity__summary-info > div.pv-entity__degree-info > p.pv-entity__fos > span:nth-child(2)")?.innerText;
                const schoolStartDate = educationItem.querySelector("div.pv-entity__summary-info > p.pv-entity__dates > span:nth-child(2) > time:nth-child(1)")?.innerText;
                const schoolEndDate = educationItem.querySelector("div.pv-entity__summary-info > p.pv-entity__dates > span:nth-child(2) > time:nth-child(2)")?.innerText;
                
                return ({ schoolName, degreeName, disciplineName, schoolStartDate, schoolEndDate })
            });
            
            return { ...educationList}
        } catch (error) {
            throw error
        }
    }

    const createPopup = async () => {
        const styleDiv = "position: fixed;z-index: 2000;width:100%; top: 0px;left: 0px;overflow: visible;display: flex;align-items: flex-end;background-color: lightgray;font-size: 10px;padding: 10px;";
        const stylePre = "position: relative;max-height: 400px;overflow: scroll;width: 100%;";
        const div = document.createElement('div');
        div.id = "krowdy-message";
        div.style = styleDiv;
    
        const pre = document.createElement('pre');
        pre.id = "krowdy-pre";
        pre.style = stylePre;
    
        const button = document.createElement('button');
        
        button.id = "krowdy-button";
        button.style = "background: gray;border: 2px solid;padding: 8px;";
        button.innerText = "OK";
    
        const bodyElement = document.querySelector('body');
        
        bodyElement.appendChild(div);
    
        pre.innerText = "Extracting profile information...";
        div.appendChild(pre);
        div.appendChild(button);
    
        return { div, pre, button }
    }

    const { div, pre, button } = await createPopup();

    const setProfilesData = async () => {
        let profilesData;

        if (window.localStorage.getItem('profilesData') !== null) {
            profilesData = await JSON.parse(window.localStorage.getItem('profilesData'));
        } else {
            profilesData = [];
        }

        profilesData =  [ ...profilesData, { personalInformation, experienceInformation, educationInformation } ];
        window.localStorage.setItem('profilesData', JSON.stringify(profilesData));
        pre.innerText = JSON.stringify(JSON.parse(window.localStorage.getItem('profilesData')), null, 2);
        console.log(JSON.parse(window.localStorage.getItem('profilesData')));
    }
    
    await wait(2000).then(() => {
        pre.innerText = 'Scanning profile...';
    })
    await autoScroll('body');
    await clickOnMoreResume();
    await clickOnMoreExperience();
    await clickOnMoreEducation();

    const personalInformation = await getPersonalInformation();
    const experienceInformation = await getExperienceInformation();
    const educationInformation = await getEducationInformation();

    pre.innerText = 'We have the profile information';

    /*
        If profilesData exists, it's updated with the information from the current profile.
        Otherwise, we create a new array to add the information and replace profilesData with it.
    */

    await wait(3000).then(() => {
        setProfilesData();
    });

    button.addEventListener("click", () => {
        div.remove();
    });
}

// Gets the list of profiles and stores the array

const scanningProfiles = async () => {
    const elementAllProfiles = document.querySelectorAll("ul.reusable-search__entity-results-list > li.reusable-search__result-container");
    const profilesArray = Array.from(elementAllProfiles);

    const profilesList = profilesArray.map((profileItem) => {
        const elementProfileContainer = profileItem.querySelector("div.entity-result > div.entity-result__item > div.entity-result__content > div > div");
        const profileLink = elementProfileContainer.querySelector("div > span > div > span.entity-result__title-line > span.entity-result__title-text > a.app-aware-link").href;
        return ( profileLink )
    });

    console.log(profilesList);

    if(profilesList.length > 0) {
        window.localStorage.removeItem('profilesData');
        window.localStorage.setItem('profilesList', JSON.stringify(profilesList));
        // window.location.href = profilesList[0];
    }
}

/*
    Compare the current URL with the array of profiles.
    In case of a match, scrapingProfile() is executed and the current URL is removed from the array.
    If there are still elements, go to the next URL, otherwise, the array of profiles is removed.
*/

(async function() {
    chrome.runtime.onConnect.addListener(async function(port) {
        port.onMessage.addListener(async function(message) {
            const { action } = message;
            // alert("App.js action: "+ action);
            if(action == 'scanning') {
                window.localStorage.clear();
                await scanningProfiles();
                // Save profiles list array
                // const list = await scanningProfiles();
                const list = [];
                // chrome.runtime.sendMessage({action: 'endScan'})
                port.postMessage({action:'endScan', list}); // Doesn't work. Why? :(
            } else if(action == 'scraping') {
                alert('Entra al action scraping')
                const getProfilesListLS = JSON.parse(window.localStorage.getItem('profilesList'));
                window.location.href = getProfilesListLS[0];
            }
        });
    });

    try {

        if (window.localStorage.getItem('profilesList') !== null) {
            const currentURL = window.location.href;
            const getProfilesListLS = JSON.parse(window.localStorage.getItem('profilesList'));
            const currentProfile = currentURL.substring(0, currentURL.length - 1);
            const currentProfileIndex = getProfilesListLS.indexOf(currentProfile);

            if (getProfilesListLS.includes(currentProfile)) {
                await scrapingProfile();

                wait(3000).then(() => {
                    if (currentProfileIndex > - 1 ) {
                        getProfilesListLS.splice(currentProfileIndex, 1);
                        window.localStorage.setItem('profilesList', JSON.stringify(getProfilesListLS) );

                        if (getProfilesListLS.length > 0) {
                            window.location.href = getProfilesListLS[0];
                        } else {
                            localStorage.removeItem('profilesList');
                        }
                    }
                });
            }
        }
    } catch (error) {
        throw error
    }
})();