import Apify from 'apify';
import { PuppeteerHandlePageInputs, PuppeteerCrawler, RequestQueue } from 'apify';
import * as tools from './tools';
import { addWebhookToTutorialThree, sendEmail } from './tools';
const {
    utils: { log },
} = Apify;

Apify.main(async (): Promise<void> => {
    log.info("Starting actor.");
    const requestQueue: RequestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest(await tools.getSearchSource());

    const proxyConfiguration = await tools.setProxy();

    const router = tools.createRouter(requestQueue);

    const handlePageFunction = async (context: PuppeteerHandlePageInputs): Promise<void> => {
        const { request } = context;
        log.info(`Processing ${request.url}`);
        await router(request.userData.label, context);
    };

    log.debug("Setting up crawler.");
    const crawler: PuppeteerCrawler = new Apify.PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,
        handlePageFunction,
        maxRequestRetries: 3,
        gotoTimeoutSecs: 120
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Actor finished.");

    // Send Email
    await sendEmail();

    // Created from Apify Tutorial Three
    await addWebhookToTutorialThree();
});