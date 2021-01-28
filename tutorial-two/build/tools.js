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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWebhookToTutorialThree = exports.sendEmail = exports.createRouter = exports.getSearchSource = exports.setProxy = exports.cleanHtmlString = exports.uniqueKey = void 0;
const Apify = __importStar(require("apify"));
const interfaces_1 = require("./interfaces");
const routes = __importStar(require("./routes"));
const { utils: { log } } = Apify;
exports.uniqueKey = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`;
};
exports.cleanHtmlString = (str) => {
    return str.trim().replace(/\n/img, "");
};
exports.setProxy = async () => {
    return await Apify.createProxyConfiguration({
        groups: ["BUYPROXIES94952", "StaticUS3"]
    });
};
exports.getSearchSource = async () => {
    const input = await Apify.getInput();
    return {
        url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}`,
        userData: {
            label: "productList",
            keyword: input.keyword
        },
    };
};
exports.createRouter = (requestQueue) => {
    return async (routeName, requestContext) => {
        const route = routes[routeName];
        if (!route)
            throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, requestQueue);
    };
};
exports.sendEmail = async () => {
    log.info("Sending Email...");
    const dataset = await Apify.openDataset();
    const datasetUrl = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items`;
    const message = `I have completed second tutorial exercise and this is my <a href='${datasetUrl}'>DATASET LINK</a><br><br>
    Please also check my <a href='https://github.com/sohebcakewalk/apify_tutorials/tree/main/tutorial-two'>Github URL</a> for Quiz Q&A and source code.`;
    const objEmail = {
        to: "lukas@apify.com",
        subject: "SOHEB: This is for the Apify SDK exercise (Tutorial II)",
        html: message
    };
    await Apify.call("apify/send-mail", objEmail);
    log.info("Email Sent");
};
exports.addWebhookToTutorialThree = async () => {
    // Used named dataset, but later update it default dataset;
    //const dataset: Dataset = await Apify.openDataset(ENVKEY.DATASET, { forceCloud: true });
    const dataset = await Apify.openDataset();
    const payloadTemplate = `{
        "userId": {{userId}},
        "createdAt": {{createdAt}},
        "eventType": {{eventType}},
        "eventData": {{eventData}},
        "resource": {{resource}},
        "datasetId":"${dataset.datasetId}"
    }`;
    await Apify.addWebhook({
        eventTypes: [interfaces_1.EVENT_TYPES.SUCCEEDED],
        requestUrl: "https://api.apify.com/v2/acts/sohebrapati~tutorial-three/runs?token=JCyt3zC9F3zsigH9xHC6QtQYj",
        payloadTemplate: payloadTemplate,
        idempotencyKey: process.env.APIFY_ACTOR_RUN_ID
    });
    log.info('Webhook for TutorialThree added successfully!');
};
//# sourceMappingURL=tools.js.map