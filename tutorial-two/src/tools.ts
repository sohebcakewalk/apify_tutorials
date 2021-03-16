import * as Apify from "apify";
import { PuppeteerHandlePageInputs, RequestQueue, ProxyConfiguration, Dataset } from "apify";
import { Email, Url, EVENT_TYPES } from "./interfaces";
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
        //groups: ["BUYPROXIES94952", "StaticUS3"] // Commented as per tutorial six exercise instruction to use only proxy group `BUYPROXIES94952`
        groups: ["BUYPROXIES94952"]
    });
};

export const getSearchSource = async (): Promise<Url> => {
    const input: any = await Apify.getInput();
    return <Url>{
        url: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${input.keyword}`,
        userData: {
            label: "productList",
            keyword: input.keyword
        }
    };
};

export const createRouter = (requestQueue: RequestQueue, dataASINs: any) => {
    return async (routeName: string, requestContext?: PuppeteerHandlePageInputs): Promise<any> => {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, requestQueue, dataASINs);
    };
};

export const sendEmail = async (): Promise<void> => {
    const input: any = await Apify.getInput();
    let toEmail: string = "lukas@apify.com";
    if (input.toEmail && input.toEmail.trim() !== "") {
        toEmail = input.toEmail;
    }

    log.info("Sending Email...");

    const dataset: Dataset = await Apify.openDataset();
    const datasetUrl: string = `https://api.apify.com/v2/datasets/${dataset.datasetId}/items`;
    const message: string = `I have completed second tutorial exercise and this is my <a href='${datasetUrl}'>DATASET LINK</a><br><br>
    Please also check my <a href='https://github.com/sohebcakewalk/apify_tutorials/tree/main/tutorial-two'>Github URL</a> for Quiz Q&A and source code.`;
    const objEmail: Email = {
        to: toEmail,
        subject: "SOHEB: This is for the Apify SDK exercise (Tutorial II)",
        html: message
    };

    await Apify.call("apify/send-mail", objEmail);

    log.info("Email Sent");
};

export const addWebhookToTutorialThree = async (): Promise<void> => {
    // Used named dataset, but later update it default dataset;
    //const dataset: Dataset = await Apify.openDataset(ENVKEY.DATASET, { forceCloud: true });
    const dataset: Dataset = await Apify.openDataset();

    const payloadTemplate: string = `{
        "userId": {{userId}},
        "createdAt": {{createdAt}},
        "eventType": {{eventType}},
        "eventData": {{eventData}},
        "resource": {{resource}},
        "datasetId":"${dataset.datasetId}"
    }`;

    await Apify.addWebhook({
        eventTypes: [EVENT_TYPES.SUCCEEDED],
        requestUrl: `https://api.apify.com/v2/acts/sohebrapati~tutorial-three/runs?token=${process.env.APIFY_TOKEN}`,
        payloadTemplate: payloadTemplate,
        idempotencyKey: process.env.APIFY_ACTOR_RUN_ID
    });

    log.info('Webhook for TutorialThree added successfully!');
}

// Add persistState event to Persist data - Tutorial Seven
export const addMigrationEvent = (dataASINs: any): void => {
    Apify.events.on('persistState', async () => {
        log.info("Persisting data started!")
        await Apify.setValue('dataASINs', dataASINs);
        log.info("Persisting data completed!")
    });
}

// Log ASINs object every 20 seconds - Tutorial Seven
export const logASINs = async (dataASINs: any) => {
    setInterval(() => {
        log.info("ASINs object - ", dataASINs)
    }, 20000);
}