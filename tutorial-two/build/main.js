"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
const tools = __importStar(require("./tools"));
const tools_1 = require("./tools");
const { utils: { log }, } = apify_1.default;
apify_1.default.main(async () => {
    log.info("Starting actor.");
    const requestQueue = await apify_1.default.openRequestQueue();
    await requestQueue.addRequest(await tools.getSearchSource());
    const proxyConfiguration = await tools.setProxy();
    const dataASINs = (await apify_1.default.getValue('dataASINs')) || {};
    const router = tools.createRouter(requestQueue, dataASINs);
    tools.addMigrationEvent(dataASINs);
    tools.logASINs(dataASINs);
    const handlePageFunction = async (context) => {
        const { request, session, puppeteerPool, page } = context;
        try {
            const title = await page.title();
            if (page.url().includes('sorry') || title.includes('sorry')) {
                await puppeteerPool.retire(page.browser());
                throw new Error(`Request blocked or we got captcha for ${request.url}`);
            }
            log.info(`Processing ${request.url}`);
            await router(request.userData.label, context);
        }
        catch (error) {
            log.info(`Error occured in handlePageFunction for ${request.url}`, error);
            session.retire();
        }
    };
    log.info("Setting up crawler.");
    const crawler = new apify_1.default.PuppeteerCrawler({
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
            const response = page.goto(request.url).catch(() => null);
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
    await tools_1.sendEmail();
    // Created from Apify Tutorial Three
    await tools_1.addWebhookToTutorialThree();
});
//# sourceMappingURL=main.js.map