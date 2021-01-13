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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
const interfaces_1 = require("./interfaces");
const tools = __importStar(require("./tools"));
const tools_1 = require("./tools");
const { utils: { log }, } = apify_1.default;
apify_1.default.main(async () => {
    log.info("Starting actor.");
    const requestQueue = await apify_1.default.openRequestQueue(interfaces_1.ENVKEY.QUEUENAME);
    await requestQueue.addRequest(await tools.getSearchSource());
    const proxyConfiguration = await tools.setProxy();
    const router = tools.createRouter(requestQueue);
    const handlePageFunction = async (context) => {
        const { request } = context;
        log.info(`Processing ${request.url}`);
        await router(request.userData.label, context);
    };
    log.debug("Setting up crawler.");
    const crawler = new apify_1.default.PuppeteerCrawler({
        requestQueue,
        proxyConfiguration,
        handlePageFunction,
        maxRequestRetries: 3,
        gotoTimeoutSecs: 120
    });
    log.info("Starting the crawl.");
    await crawler.run();
    log.info("Actor finished.");
    await tools_1.sendEmail();
});
//# sourceMappingURL=main.js.map