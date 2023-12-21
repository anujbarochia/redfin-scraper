/**
 * This template is a production ready boilerplate for developing with `PuppeteerCrawler`.
 * Use this to bootstrap your projects using the most up-to-date code.
 * If you're looking for examples or want to learn more, see README.
 */

// For more information, see https://docs.apify.com/sdk/js

const {
    Actor
} = require("apify");
const routes = require("./routes");
const {
    PuppeteerCrawler,
    Dataset,
    RequestQueue,
    RequestList,
} = require("crawlee");

Actor.main(async () => {
    const input = await Actor.getInput();
    const store = await Actor.openKeyValueStore('alreadyScrapedData');

    // LANDING PAGE EXTRACTION
    const requestList = await RequestList.open(null, input.listUrls || []);
    const requestQueue = await RequestQueue.open();

    const enqueue = async (request) => {
        return requestQueue.addRequest(request, {
            forefront: request.userData.forefront,
        });
    };

    const pushData = async (item) => {
        Dataset.pushData(item);
    };

    const proxyConfiguration = await Actor.createProxyConfiguration(
        input.proxy
    );

    const options = {
        maxConcurrency: 2,
        proxyConfiguration,
        requestQueue,
        requestList,
        maxRequestRetries: 10,
        useSessionPool: true,
        launchContext: {
            launchOptions: {
                headless: false,
                defaultViewport: null,
                args: [
                    "--window-size=1920,1080",
                    "--force-device-scale-factor=1",
                ],
            },
        },
        preNavigationHooks: [
            async ({
                page,
                request
            }, gotoOptions) => {
                if (request.label != "DETAIL") {
                    gotoOptions.waitUntil = "networkidle2";
                    gotoOptions.waitUntil = "domcontentloaded";
                } else {
                    gotoOptions.waitUntil = "networkidle2";
                }
            },
        ],
        requestHandler: async (context) => {
            let {
                request
            } = context;
            console.log(
                `Opening page ${request.label || "START"} : ${request.url}`
            );
            context.input = input;
            switch (request.label) {
                case "DETAIL":
                    return routes.handleDetail({
                        context,
                        pushData,
                        store,
                        Actor
                    });
                case "LIST":
                    return routes.handleList({
                        context,
                        enqueue,
                    });
                default:
                    return routes.handleLanding({
                        context,
                        enqueue,
                    });
            }
        },
    };

    const crawler = new PuppeteerCrawler(options);

    console.log("Starting the crawl.");
    await crawler.run();
    console.log("Crawl finished.");
});
