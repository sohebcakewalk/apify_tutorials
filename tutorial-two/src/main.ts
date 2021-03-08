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
        const { request, session, puppeteerPool, page } = context;
        try {
            const title = await page.title();

            if (page.url().includes('sorry') || title.includes('sorry')) {
                await puppeteerPool.retire(page.browser());
                throw new Error(`Request blocked or we got captcha for ${request.url}`);
            }

            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);

        } catch (error) {
            log.info(`Error occured in handlePageFunction for ${request.url}`, error);
            session.retire();
        }
    };

    log.info("Setting up crawler.");
    const crawler: PuppeteerCrawler = new Apify.PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,

        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 1,
            sessionOptions: {
                maxUsageCount: 5,
                sessionPool: undefined
            },
        },
        persistCookiesPerSession: true,
        maxConcurrency: 1,

        gotoFunction: async ({ request, page, puppeteerPool }) => {
            const response = page.goto(request.url).catch(() => null)
            if (!response) {
                await puppeteerPool.retire(page.browser());
                throw new Error(`Page didn't load for ${request.url}`);
            }
            return response;
        },
        handlePageFunction,
        handleFailedRequestFunction: async ({ request, error }) => {
            log.info(`Error occured for ${request.url}`, error);
        },
        maxRequestRetries: 2
    });

    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Actor finished.");

    // Send Email
    await sendEmail();

    // Created from Apify Tutorial Three
    await addWebhookToTutorialThree();
});