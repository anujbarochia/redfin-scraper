const {
    extractList
} = require("../extract");

module.exports = async ({
    context,
    enqueue
}) => {
    let {
        request,
        page,
        input
    } = context;

    const pages = 9

    for (let i = 0; i < pages; i++) {
        await enqueue({
            url: `${request.url}/page-${i}`,
            userData: {
                forefront: true,
            },
            label: "LIST",
        });
    }

    await extractList({
        context,
        enqueue
    });

    // login 
    await page.goto('https://www.redfin.com/login', {
        timeout: 1000 * 60 * 5
    })

    await page.type('[name="emailInput"]', input.email, {
        delay: 100
    });

    await page.type('[name="passwordInput"]', input.password, {
        delay: 100
    });

    await page.click('[type="submit"]')

    await page.waitForTimeout(1000 * 500);
};
