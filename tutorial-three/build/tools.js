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
exports.processCheapestOffer = exports.getProductDetailsWithPrice = void 0;
const Apify = __importStar(require("apify"));
const { utils: { log }, } = Apify;
const removeDollarFromAmount = (amount) => {
    if (amount.trim() != "" && amount.trim() != "free") {
        amount = amount.replace("$", "");
        return parseFloat(amount);
    }
    return 0;
};
exports.getProductDetailsWithPrice = (objAmazonData) => {
    const price = removeDollarFromAmount(objAmazonData.price) + removeDollarFromAmount(objAmazonData.shippingPrice);
    return {
        price,
        productDetails: objAmazonData
    };
};
exports.processCheapestOffer = async () => {
    //const dataset: Dataset = await Apify.openDataset(ENVKEY.DATASET, { forceCloud: true });
    const dt = await Apify.getInput();
    //log.info("Tutorial Three Input - ", dt);
    console.log("Tutorial Three Input - ");
    console.dir(dt);
    const dataset = await Apify.openDataset(dt.datasetId, { forceCloud: true });
    const datasetContent = await dataset.getData();
    if (datasetContent.count > 0) {
        const arrAmazonData = datasetContent.items;
        const arrProductDetailsByUrl = [];
        for (var i = 0; i < arrAmazonData.length; i++) {
            const objAmazonData = arrAmazonData[i];
            const findProductDetailsByUrl = arrProductDetailsByUrl.find(a => a.url == objAmazonData.url);
            if (findProductDetailsByUrl) {
                findProductDetailsByUrl.productDetailWithPrice.push(exports.getProductDetailsWithPrice(objAmazonData));
            }
            else {
                arrProductDetailsByUrl.push({
                    url: objAmazonData.url,
                    productDetailWithPrice: [exports.getProductDetailsWithPrice(objAmazonData)]
                });
            }
        }
        for (const itm of arrProductDetailsByUrl) {
            const data = itm.productDetailWithPrice.filter(a => (a.price));
            var result = data.reduce((prev, curr) => {
                return (prev.price < curr.price) ? prev : curr;
            });
            //console.log(result);
            //const dt = data.filter(a => a.price === result.price).map(a => a.productDetails);
            await Apify.pushData(result.productDetails);
        }
    }
};
//# sourceMappingURL=tools.js.map