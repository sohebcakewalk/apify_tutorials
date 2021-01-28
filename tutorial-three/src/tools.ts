import * as Apify from "apify";
import { Dataset } from "apify";
import { ProductDetails, ProductDetailsFilterByUrl, productDetailWithPrice } from "./interfaces";
const {
    utils: { log },
} = Apify;

const removeDollarFromAmount = (amount: string): number => {
    if (amount.trim() != "" && amount.trim() != "free") {
        amount = amount.replace("$", "");
        return parseFloat(amount);
    }
    return 0;
}

export const getProductDetailsWithPrice = (objAmazonData: ProductDetails,): productDetailWithPrice => {
    const price = removeDollarFromAmount(objAmazonData.price) + removeDollarFromAmount(objAmazonData.shippingPrice);
    return <productDetailWithPrice>{
        price,
        productDetails: objAmazonData
    }
}

export const processCheapestOffer = async (): Promise<void> => {
    //const dataset: Dataset = await Apify.openDataset(ENVKEY.DATASET, { forceCloud: true });
    const dt: any = await Apify.getInput();
    //log.info("Tutorial Three Input - ", dt);
    console.log("Tutorial Three Input - ");
    console.dir(dt);
    const dataset: Dataset = await Apify.openDataset(dt.datasetId, { forceCloud: true });
    const datasetContent = await dataset.getData();

    if (datasetContent.count > 0) {
        const arrAmazonData = <ProductDetails[]>datasetContent.items;
        const arrProductDetailsByUrl: ProductDetailsFilterByUrl[] = [];

        for (var i = 0; i < arrAmazonData.length; i++) {
            const objAmazonData = arrAmazonData[i];
            const findProductDetailsByUrl = arrProductDetailsByUrl.find(a => a.url == objAmazonData.url)
            if (findProductDetailsByUrl) {
                findProductDetailsByUrl.productDetailWithPrice.push(getProductDetailsWithPrice(objAmazonData));
            } else {
                arrProductDetailsByUrl.push({
                    url: objAmazonData.url,
                    productDetailWithPrice: [getProductDetailsWithPrice(objAmazonData)]
                })
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
}