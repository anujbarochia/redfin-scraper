module.exports = async ({
    context,
    enqueue
}) => {
    let {
        request,
        page
    } = context;

    await page.waitForSelector('#results-display', {
        timeout: 1000 * 30
    });
    const links = await page.evaluate(() => {
        return Array.from(new Set(Array.from(document.querySelectorAll('[id^="MapHomeCard_"] a')).map((el) => {
            return el.getAttribute('href')
        })))
    })

    for (const link of links) {
        if (!link) continue;
        // await enqueue({
        //     url: `https://www.redfin.com${link}`,
        //     userData: {
        //         id: `https://www.redfin.com${link}`,
        //         forefront: true,
        //     },
        //     label: "DETAIL",
        // });
    }
};
