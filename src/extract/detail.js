module.exports = async ({
    context
}) => {
    let {
        request,
        page
    } = context;
    await page.waitForSelector('.ListingStatusBannerSection', {
        timeout: 1000 * 30
    });
    const extractedDetails = await page.evaluate(() => {
        const propertyAddress = document.querySelector('.full-address')?.textContent

        let saleDate
        if (document.querySelector('.ListingStatusBannerSection')?.textContent?.split('FOR')[0]?.split('ON')[1]) {
            saleDate = document.querySelector('.ListingStatusBannerSection')?.textContent?.split('FOR')[0]?.split('ON')[1] ?? ""
        } else {
            saleDate = ""
        }

        let soldPrice;
        if (document.querySelector('[data-rf-test-id="abp-price"] span')?.textContent == 'Sold Price') {
            soldPrice = document.querySelector('[data-rf-test-id="abp-price"] div').textContent
        } else {
            soldPrice = document.querySelector('.ListingStatusBannerSection')?.textContent.split('FOR')[1]?.trim()
        }

        // getting element for the agents
        const agentInfoContentElements = document.querySelectorAll('.agent-info-content');
        const agentElements = [];
        agentInfoContentElements.forEach(agentInfoContent => {
            const listingAgentItems = agentInfoContent.querySelectorAll('.buyer-agent-item, .listing-agent-item');
            agentElements.push(...Array.from(listingAgentItems));
        });

        // agentsArray contains all the details about the buying/selling agent displayed by the website
        const agentsArray = [];

        agentElements.forEach(item => {
            const headingElement = item.querySelector('.agent-basic-details--heading');

            let href = '';
            let agentSlug = ''
            if (headingElement.querySelector('a')?.getAttribute('href') ?? "") {
                href = window.location.origin + headingElement.querySelector('a')?.getAttribute('href')
                agentSlug = headingElement.querySelector('a')?.getAttribute('href').replace('/real-estate-agents/', '')?.trim()
            }

            const agentType = item.classList.contains('listing-agent-item') ? 'seller' : 'buyer';

            const agentInfo = {
                agentType,
                agentProfileUrl: href,
                agentSlug,
                agentLicenseNumber: item.querySelector('.agent-basic-details--license')?.textContent?.replace('•', '')?.trim() ?? "",
                agentName: headingElement?.textContent?.replace('Bought with', '').replace('Listed by', '')?.trim() ?? "",
                agentAdress: "",
                brokerName: item.querySelector('.agent-basic-details--broker')?.textContent?.replace('•', '')?.trim() ?? "",
            };

            if (item.querySelector('.agent-extra-info--email')?.textContent?.includes('broker')) {
                agentInfo['brokerEmail'] = item.querySelector('.agent-extra-info--email')?.textContent?.replace('(broker)', '')?.replace('•', '')?.trim() ?? ""
            } else {
                agentInfo['brokerEmail'] = ''
            }

            if (item.querySelector('.agent-extra-info--email')?.textContent?.includes('agent')) {
                agentInfo['agentEmail'] = item.querySelector('.agent-extra-info--email')?.textContent?.replace('(agent)', '')?.replace('•', '')?.trim() ?? ""
            } else {
                agentElements['agentEmail'] = ''
            }

            if (item.querySelector('.agent-extra-info--phone')?.textContent?.includes('broker')) {
                agentInfo['brokerPhoneNo'] = item.querySelector('.agent-extra-info--phone')?.textContent?.replace('(broker)', '')?.replace('•', '')?.trim() ?? "";
            } else {
                agentInfo['brokerPhoneNo'] = ''
            }

            if (item.querySelector('.agent-extra-info--phone')?.textContent?.includes('agent')) {
                agentInfo['agentPhoneNo'] = item.querySelector('.agent-extra-info--phone')?.textContent?.replace('(agent)', '')?.replace('•', '')?.trim() ?? "";
            } else {
                agentInfo['agentPhoneNo'] = ''
            }

            agentsArray.push(agentInfo);
        });

        // Date scraped
        const dateScrapedOn = new Date().toJSON().slice(0, 10);

        // Datetime redfin updated
        const redfinLastChecked = document.querySelector('.data-quality')?.textContent.split('ago')[1]?.replace('(', '').replace(')', '')?.trim() ?? ""

        // Redfin source
        const redfinSource = document.querySelector('.ListingSource')?.textContent.replace('•Source:', '') ?? ""

        return {
            propertyAddress,
            saleDate,
            soldPrice,
            agentsArray,
            dateScrapedOn,
            redfinLastChecked,
            redfinSource
        }
    })

    const scrapingDetails = await page.evaluate(() => {

        //date scraped
        const dateScrapedOn = new Date().toJSON().slice(0, 10);

        //html
        const fullHTML = document.documentElement.outerHTML;

        return {
            dateScrapedOn,
            fullHTML
        }
    })

    //scraped url
    scrapingDetails["scrapedURL"] = request.url

    return {
        extractedDetails,
        scrapingDetails
    }
}
