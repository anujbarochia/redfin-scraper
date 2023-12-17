module.exports = async ({
    context
}) => {
    let {
        request,
        page
    } = context;
    const extractedDetails = await page.evaluate(() => {
        const propertyAddress = document.querySelector('.full-address')?.textContent
        const saleDate = document.querySelector('.ListingStatusBannerSection')?.textContent.split('FOR')[0].split('ON')[1].trim()
        let soldPrice;
        if (document.querySelector('[data-rf-test-id="abp-price"] span')?.textContent == 'Sold Price') {
            soldPrice = document.querySelector('[data-rf-test-id="abp-price"] div').textContent
        } else {
            soldPrice = document.querySelector('.ListingStatusBannerSection')?.textContent.split('FOR')[1].trim()
        }

        // Buyer’s Agent
        const buyersAgent = {
            // agent license number
            agentLicenseNumber: document.querySelector('.buyer-agent-item .agent-basic-details--license')?.textContent.trim(),
            // agent name
            agentName: document.querySelector('.buyer-agent-item .agent-basic-details--heading')?.textContent.trim(),
            // agent phone number
            agentPhoneNo: undefined,
            // agent email
            agentEmail: undefined,
            // agent address
            agentAdress: undefined,
            // brokerage name
            brokerageName: document.querySelector('.buyer-agent-item .agent-basic-details--broker')?.textContent.trim(),
            // brokerage email
            brokerageEmail: undefined,
            // brokerage phone number
            brokeragePhoneNumber: undefined,
        }

        //  Seller’s Agent
        const sellersAgent = {
            // agent license number
            agentLicenseNumber: document.querySelector('.AgentInfoCard .agent-basic-details--license')?.textContent.trim(),
            // agent name
            agentName: document.querySelector('.AgentInfoCard .agent-basic-details--heading')?.textContent.trim(),
            // agent phone number
            agentPhoneNo: undefined,
            // agent email
            agentEmail: undefined,
            // agent address
            agentAdress: undefined,
            // brokerage name
            brokerageName: document.querySelector('.AgentInfoCard .agent-basic-details--broker')?.textContent.trim(),
            // brokerage email
            brokerageEmail: undefined,
            // brokerage phone number
            brokeragePhoneNumber: undefined,
        }


        // Date scraped
        const dateScrapedOn = new Date().toJSON().slice(0, 10);

        // Datetime redfin updated
        const redfinLastChecked = document.querySelector('.data-quality')?.textContent.split('ago')[1].trim()

        // Redfin source
        const redfinSource = document.querySelector('.ListingSource')?.textContent.replace('•Source:', '')

        return {
            propertyAddress,
            saleDate,
            soldPrice,
            buyersAgent,
            sellersAgent,
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
