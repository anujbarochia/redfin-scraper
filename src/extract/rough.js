const agentInfoContentElements = document.querySelectorAll('.agent-info-content');

const agentElements = [];

agentInfoContentElements.forEach(agentInfoContent => {
    const listingAgentItems = agentInfoContent.querySelectorAll('.buyer-agent-item, .listing-agent-item');

    agentElements.push(...Array.from(listingAgentItems));
});


const agentsArray = [];

agentElements.forEach(item => {
    const headingElement = item.querySelector('.agent-basic-details--heading');

    let href = '';
    let agentSlug = ''
    if (headingElement.querySelector('a')?.getAttribute('href') ?? "") {
        href = window.location.origin + headingElement.querySelector('a')?.getAttribute('href')
        agentSlug = headingElement.querySelector('a')?.getAttribute('href').replace('/real-estate-agents/', '').trim()
    }

    const agentType = item.classList.contains('listing-agent-item') ? 'listing' : 'buyer';

    const agentInfo = {
        agentType: agentType,
        agentProfileUrl: href,
        agentSlug,
        agentLicenseNumber: item.querySelector('.agent-basic-details--license')?.textContent?.replace('•', '').trim() ?? "",
        agentName: headingElement?.textContent?.replace('Bought with', '').replace('Listed by', '').trim() ?? "",
        agentAdress: "",
        brokerName: item.querySelector('.agent-basic-details--broker')?.textContent?.replace('•', '').trim() ?? "",
    };

    if (item.querySelector('.agent-extra-info--email')?.textContent?.includes('broker')) {
        agentInfo['brokerEmail'] = item.querySelector('.agent-extra-info--email')?.textContent?.replace('(broker)', '')?.replace('•', '').trim() ?? ""
        agentInfo['agentEmail'] = ''
    } else {
        agentInfo['agentEmail'] = item.querySelector('.agent-extra-info--email')?.textContent?.replace('•', '').trim() ?? ""
        agentInfo['brokerEmail'] = ''
    }

    if (item.querySelector('.agent-extra-info--phone')?.textContent?.includes('broker')) {
        agentInfo['brokerPhoneNumber'] = item.querySelector('.agent-extra-info--phone')?.textContent?.replace('(broker)', '')?.replace('•', '').trim() ?? "";
        agentInfo['agentPhoneNo'] = ''
    } else {
        agentInfo['agentPhoneNo'] = item.querySelector('.agent-extra-info--phone')?.textContent?.replace('•', '').trim() ?? "";
        agentInfo['brokerPhoneNumber'] = ''

    }

    agentsArray.push(agentInfo);
});

agentsArray;

// console.log(agentElements);
let obj1 = {
    propertyAddress: "1406 S Chadwick St,Philadelphia, PA 19146",
    saleDate: 'SEP 4, 2020',
    soldPrice: '$235,000',
    agentsArray: [{

        agentAdress: "",
        agentEmail: "",
        agentLicenseNumber: "DRE #02045690",
        agentName: "David M Orr",
        agentPhoneNo: "",
        agentProfileUrl: "https://www.redfin.com/real-estate-agents/david-m-orr",
        agentSlug: "david-m-orr",
        agentType: "listing",
        brokerEmail: "",
        brokerName: "Redfin Corporation",
        brokerPhoneNumber: "",
    }, {

        agentAdress: "",
        agentEmail: "",
        agentLicenseNumber: "",
        agentName: "Laura Seaman",
        agentPhoneNo: "",
        agentProfileUrl: "",
        agentSlug: "",
        agentType: "buyer",
        brokerEmail: "marianne.dillon@compass.com",
        brokerName: "Compass RE",
        brokerPhoneNumber: "267-435-8015"
    }],
    dateScrapedOn: '2023-12-21',
    redfinLastChecked: '(Dec 21, 2023 at 12:30pm)',
    redfinSource: 'BRIGHT MLS #PAPH915310'
}

let obj2 = {
    agentEmail: "david.m.orr@redfin.com",
    agentJobTitle: "Redfin Principal Agent",
    agentLicenseNumber: "02045690",
    agentPhoneNo: "(916) 299-7767",
    avgRating: 9.65,
    avgRatingForCustomerDisplay: 4.8,
    dealVolume: "$96M",
    highestDealPrice: "$980K",
    numHomesClosed: 200,
    totalDealsAtRedfin: "185",
    topCities: ['Sacramento', 'Elk Grove', 'West Sacramento', 'Stockton', 'Davis', 'Rancho Cordova', 'Woodland', 'Carmichael', 'Galt', 'Fair Oaks']
}

function mergeObjects(obj1, obj2) {
    Object.keys(obj2).forEach((key) => {
        if (obj1[key] === '' && obj2[key] !== '') {
            obj1[key] = obj2[key];
        }
    });
    Object.keys(obj2).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj1, key)) {
            obj1[key] = obj2[key];
        }
    });
    return obj1;
}

for (const obj of details.extractedDetails.agentsArray) {
    const mergedObject = mergeObjects(obj, agentDetails);
    obj = mergedObject
}
