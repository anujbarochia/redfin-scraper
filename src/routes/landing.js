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

    const totalHomes = await page.evaluate(() => {
        return Number(document.querySelector('[data-rf-test-id="homes-description"]').childNodes[0]?.textContent.replace(/,/g, '') || 0);
    });

    let extractPage = true;
    console.log(`Total items : ${totalHomes} - ${request.url}`);
    let range = request.userData.range;

    if (totalHomes > 350 && (!range || ((range.max || 3200) - (range.min || 0)) > 50)) {
        extractPage = false;
        // let range = request.userData.range;
        if (!range) {
            range = {
                min: null,
                max: null
            }
        }

        const duration = request.url.split('include=').pop();
        const baseUrl = request.url.split('/filter/')[0];

        let newMin = range.min;
        let newMax = range.max ? range.max / 2 : 1600;

        if (newMin >= newMax) {
            let increment = (range.max / 4);
            if (increment <= 75) {
                increment = 50;
            }
            newMax = newMin + increment;
        }

        if (newMax >= 50) {
            console.log(`Segmenting - ${request.url}`, {
                newMin,
                newMax
            });
            await enqueue({
                url: `${baseUrl}/filter/${newMin? 'min-price-per-sqft='+newMin +',': ''}${newMax ? 'max-price-per-sqft='+newMax+',': ''}include=${duration}`,
                userData: {
                    forefront: true,
                    range: {
                        min: newMin,
                        max: newMax
                    }
                },
                label: "LANDING",
            });

        } else {
            extractPage = true;
        }

        newMin = newMax;
        newMax = range.max;

        if (newMin >= 50) {
            console.log(`Segmenting - ${request.url} `, {
                newMin,
                newMax
            });
            await enqueue({
                url: `${baseUrl}/filter/${newMin? 'min-price-per-sqft='+newMin+',' : ''}${newMax ? 'max-price-per-sqft='+newMax+ ',': ''}include=${duration}`,
                userData: {
                    forefront: true,
                    range: {
                        min: newMin,
                        max: newMax
                    }
                },
                label: "LANDING",
            });
        } else {
            extractPage = true;
        }
    } else {
        extractPage = true;
    }

    if (extractPage) {
        console.log(`Extarcting page: ${totalHomes} - ${request.url}`);
        const pages = Number(document.querySelector('[data-rf-test-name="download-and-save-page-number-text"]').textContent.replace('Viewing page 1 of', '').trim())

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

    }


    // login 
    // await page.goto('https://www.redfin.com/login', {
    //     timeout: 1000 * 60 * 5
    // })

    // await page.type('[name="emailInput"]', input.email, {
    //     delay: 100
    // });

    // await page.type('[name="passwordInput"]', input.password, {
    //     delay: 100
    // });

    // await page.click('[type="submit"]')

    // await page.waitForTimeout(1000 * 500);
};
