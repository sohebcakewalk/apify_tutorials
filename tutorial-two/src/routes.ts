import * as Apify from "apify";
import { PuppeteerHandlePageInputs, RequestQueue, Request } from "apify";
import { ProductDetails, Url } from "./interfaces";
import { cleanHtmlString, uniqueKey } from "./tools";

/**
* This method will check for the product ASIN from amazon product listing page and based on product ASIN, add request queue for product detail.
*/
export const productList = async ({ request, page }: PuppeteerHandlePageInputs, requestQueue: RequestQueue, dataASINs: any): Promise<void> => {
    const { userData: { keyword } } = request;
    const arrAsin = await page.$$eval(".s-asin", async ($posts: Element[]) => {
        const arrAsin: string[] = [];
        $posts.forEach(($post: Element) => {
            const asin: string = $post.getAttribute("data-asin");
            if (typeof asin !== "undefined" && asin && arrAsin.indexOf(asin) == -1) {
                arrAsin.push(asin);
            }
        });
        return arrAsin;
    });

    for (let i = 0; i < arrAsin.length; i++) {
        dataASINs[arrAsin[i]] = 0;
        const objRequest: Url = <Url>{
            url: `https://www.amazon.com/dp/${arrAsin[i]}`,
            userData: {
                label: "productDetail", keyword, asin: arrAsin[i]
            },
            uniqueKey: uniqueKey()
        };
        await requestQueue.addRequest(objRequest);
    }
};

/**
* This method will fetch the title, productUrl and product description from the product detail page. After fetching all these details it will add request queue for product offer.
*/
export const productDetail = async ({ request, page }: PuppeteerHandlePageInputs, requestQueue: RequestQueue): Promise<void> => {
    const title: string = await page.title();
    if (title != "") {
        const productUrl: string = await page.evaluate(() => {
            const objLink = document.querySelector("link[rel='canonical']");
            if (objLink) {
                return objLink.getAttribute("href");
            }
            return "";
        });
        const data: string[] = await page.$$eval("div#feature-bullets > ul li", nodes => nodes.map(node => (<HTMLElement>node).innerText));
        if (data.length > 0) {
            const { userData: { asin, keyword } } = request;
            const description = cleanHtmlString(data.join(", "));
            const objRequest: Url = <Url>{
                url: `https://www.amazon.com/gp/offer-listing/${asin}`,
                userData: {
                    label: "productOffer", keyword, title, description, productUrl
                },
                uniqueKey: uniqueKey()
            };
            await requestQueue.addRequest(objRequest);
        }
    }
};
/**
* This method will fetch price, shiping price (if any) and seller name. And create product detail da which contains title, description, keyword, url, price, shippingPrice and sellerName push to apify cloud dataset.
*/
export const productOffer = async ({ request, page }: PuppeteerHandlePageInputs, requestQueue: RequestQueue, dataASINs: any): Promise<void> => {
    const { userData: { asin } } = request;
    const arrAmazonData: ProductDetails[] = await page.$$eval("div.olpOffer", ($posts: Element[], request: Request) => {
        const { userData: { keyword, title, desc, productUrl } } = request;
        const arrProductDetail: ProductDetails[] = [];
        for (let i = 0; i < $posts.length; i++) {
            const $post = $posts[i];
            const productDetail: ProductDetails = {
                title: title,
                description: desc,
                keyword: keyword,
                url: productUrl
            }
            productDetail.price = (<HTMLElement>$post.querySelector(".olpOfferPrice")).innerText;
            productDetail.shippingPrice = (<HTMLElement>$post.querySelector(".olpShippingInfo")).innerText;
            if (productDetail.shippingPrice.trim() === "" || productDetail.shippingPrice.toLowerCase().indexOf("free") != -1) {
                productDetail.shippingPrice = "free";
            } else {
                productDetail.shippingPrice = productDetail.shippingPrice.replace("+", "").replace("shipping", "").trim();
            }
            productDetail.sellerName = (<HTMLElement>$post.querySelector(".olpSellerName")).innerText || "amazon.com";
            arrProductDetail.push(productDetail);
        }
        return arrProductDetail;
    }, request);

    if (asin) {
        dataASINs[asin] = arrAmazonData.length;
    }
    const dataset = await Apify.openDataset();
    await dataset.pushData(arrAmazonData);
};