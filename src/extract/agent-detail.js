module.exports = async (
    context, url, agentSlug
) => {
    let {
        request,
        page
    } = context;
    console.log(url, agentSlug);
    await page.goto(url, {
        timeout: 1000 * 30,
        waitUntil: 'networkidle0'
    });
    await page.waitForSelector('[data-rf-test-name="agent-name"]')
    const agentDetail = await page.evaluate((agentSlug) => {
        const mainObj = window.__reactServerState.InitialContext['ReactServerAgent.cache'].dataCache
        const subObj1 = mainObj[`/stingray/agents/data/agent-profile/${agentSlug}/url/get`].res.body.payload
        const subObj2 = mainObj[`/stingray/agents/data/${agentSlug}/agent-stats/get`].res.body.payload
        const subObj3 = mainObj[`/stingray/agents/data/agent-profile/${agentSlug}/rollup/get`].res.body.payload

        const agentEmail = subObj1.agentEmail
        const avgRating = subObj1.avgRating
        const agentJobTitle = subObj1.jobTitle
        const agentLicenseNumber = subObj1.licenseNumber
        const agentPhoneNo = mainObj[`/stingray/agents/data/agent-profile/${agentSlug}/phone/get`].res.body.payload.phoneNumber
        const numHomesClosed = subObj1.numHomesClosed
        const avgRatingForCustomerDisplay = subObj1.avgRatingForCustomerDisplay

        const agentStats = subObj2
        const totalDealsAtRedfin = subObj2.statDisplayGroup.statDisplayList[0].value
        const dealVolume = subObj2.statDisplayGroup.statDisplayList[1].value
        const highestDealPrice = subObj2.statDisplayGroup.statDisplayList[2].value

        let topCities
        if (subObj3.topCities.length) {
            topCities = subObj3.topCities.map((el) => {
                return el.name
            })
        } else {
            topCities = subObj3.selectedRegions.map((el) => {
                return el.name
            })
        }

        return {
            agentEmail,
            avgRating,
            agentJobTitle,
            agentLicenseNumber,
            agentPhoneNo,
            numHomesClosed,
            avgRatingForCustomerDisplay,
            agentStats,
            totalDealsAtRedfin,
            dealVolume,
            highestDealPrice,
            topCities
        }
    }, agentSlug);
    console.log("inside agent detail");
    // console.log(agentDetail);
    return agentDetail
}
