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
exports.productOffer = exports.productDetail = exports.productList = void 0;
const Apify = __importStar(require("apify"));
const tools_1 = require("./tools");
/**
* This method will check for the product ASIN from amazon product listing page and based on product ASIN, add request queue for product detail.
*/
exports.productList = async ({ request, page }, requestQueue) => {
    const { userData: { keyword } } = request;
    const arrAsin = await page.$$eval(".s-asin", async ($posts) => {
        const arrAsin = [];
        $posts.forEach(($post) => {
            const asin = $post.getAttribute("data-asin");
            if (typeof asin !== "undefined" && asin && arrAsin.indexOf(asin) == -1) {
                arrAsin.push(asin);
            }
        });
        return arrAsin;
    });
    for (let i = 0; i < arrAsin.length; i++) {
        const objRequest = {
            url: `https://www.amazon.com/dp/${arrAsin[i]}`,
            userData: {
                label: "productDetail", keyword, asin: arrAsin[i]
            },
            uniqueKey: tools_1.uniqueKey()
        };
        await requestQueue.addRequest(objRequest);
    }
};
/**
* This method will fetch the title, productUrl and product description from the product detail page. After fetching all these details it will add request queue for product offer.
*/
exports.productDetail = async ({ request, page }, requestQueue) => {
    const title = await page.title();
    if (title != "") {
        const productUrl = await page.evaluate(() => {
            const objLink = document.querySelector("link[rel='canonical']");
            if (objLink) {
                return objLink.getAttribute("href");
            }
            return "";
        });
        const data = await page.$$eval("div#feature-bullets > ul li", nodes => nodes.map(node => node.innerText));
        if (data.length > 0) {
            const { userData: { asin, keyword } } = request;
            const description = tools_1.cleanHtmlString(data.join(", "));
            const objRequest = {
                url: `https://www.amazon.com/gp/offer-listing/${asin}`,
                userData: {
                    label: "productOffer", keyword, title, description, productUrl
                },
                uniqueKey: tools_1.uniqueKey()
            };
            await requestQueue.addRequest(objRequest);
        }
    }
};
/**
* This method will fetch price, shiping price (if any) and seller name. And create product detail da which contains title, description, keyword, url, price, shippingPrice and sellerName push to apify cloud dataset.
*/
exports.productOffer = async ({ request, page }) => {
    const arrAmazonData = await page.$$eval("div.olpOffer", ($posts, request) => {
        const { userData: { keyword, title, desc, productUrl } } = request;
        const arrProductDetail = [];
        for (let i = 0; i < $posts.length; i++) {
            const $post = $posts[i];
            const productDetail = {
                title: title,
                description: desc,
                keyword: keyword,
                url: productUrl
            };
            productDetail.price = $post.querySelector(".olpOfferPrice").innerText;
            productDetail.shippingPrice = $post.querySelector(".olpShippingInfo").innerText;
            if (productDetail.shippingPrice.trim() === "" || productDetail.shippingPrice.toLowerCase().indexOf("free") != -1) {
                productDetail.shippingPrice = "free";
            }
            else {
                productDetail.shippingPrice = productDetail.shippingPrice.replace("+", "").replace("shipping", "").trim();
            }
            productDetail.sellerName = $post.querySelector(".olpSellerName").innerText || "amazon.com";
            arrProductDetail.push(productDetail);
        }
        return arrProductDetail;
    }, request);
    const dataset = await Apify.openDataset();
    await dataset.pushData(arrAmazonData);
};
//# sourceMappingURL=routes.js.map