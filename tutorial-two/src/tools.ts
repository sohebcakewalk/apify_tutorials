import * as Apify from "apify";
import { PuppeteerHandlePageInputs, RequestQueue, ProxyConfiguration, Dataset } from "apify";
import { ENVKEY, Email, Url } from "./interfaces";
import * as routes from "./routes";
const { utils: { log } } = Apify;

export const uniqueKey = (): string => {
    return `_${Math.random().toString(36).substr(2, 9)}`;
};

export const cleanHtmlString = (str: string): string => {
    return str.trim().replace(/\n/img, "");
};

export const setProxy = async (): Promise<ProxyConfiguration> => {
    return await Apify.createProxyConfiguration({
        groups: ["BUYPROXIES94952", "StaticUS3"]
    });
};

export const getSearchSource = async (): Promise<Url> => {
    const input: any = await Apify.getInput();
    return <Url>{
        url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}`,
        userData: {
            label: "productList",
            keyword: input.keyword
        },
    };
};

export const createRouter = (requestQueue: RequestQueue) => {
    return async (routeName: string, requestContext?: PuppeteerHandlePageInputs): Promise<any> => {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, requestQueue);
    };
};

export const sendEmail = async (): Promise<void> => {
    log.info("Sending Email...");

    const dataset: Dataset = await Apify.openDataset(ENVKEY.DATASET, { forceCloud: true });
    const datasetUrl: string = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items`;
    const message: string = `I have completed second tutorial exercise and this is my <a href='${datasetUrl}'>DATASET LINK</a><br><br>
    Please also check my <a href='https://github.com/sohebcakewalk/apify_tutorials/tree/main/tutorial-two'>Github URL</a> for Quiz Q&A and source code.`;
    const objEmail: Email = {
        to: "lukas@apify.com",
        subject: "SOHEB: This is for the Apify SDK exercise (Tutorial II)",
        html: message
    };

    await Apify.call("apify/send-mail", objEmail);

    log.info("Email Sent");
};