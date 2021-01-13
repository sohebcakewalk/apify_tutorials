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
exports.sendEmail = exports.createRouter = exports.getSearchSource = exports.setProxy = exports.cleanHtmlString = exports.uniqueKey = void 0;
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
    const dataset = await Apify.openDataset(interfaces_1.ENVKEY.DATASET, { forceCloud: true });
    const datasetUrl = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items`;
    const message = `I have completed second tutorial exercise and this is my <a href='${datasetUrl}'>DATASET LINK</>`;
    const objEmail = {
        to: "lukas@apify.com",
        subject: "SOHEB: This is for the Apify SDK exercise (Tutorial II)",
        html: message
    };
    await Apify.call("apify/send-mail", objEmail);
    log.info("Email Sent");
};
//# sourceMappingURL=tools.js.map