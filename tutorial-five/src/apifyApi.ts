import Apify from 'apify';
import got from 'got';
import { actorInput, saveToKeyValueStore } from "./tools";
const {
    utils: { log },
} = Apify;

export const callTaskWithApi = async (taskId: string, memory: number, fields: string[], limit: number, format: string): Promise<void> => {
    const apiUrl = `https://api.apify.com/v2/actor-tasks/${taskId}/runs?token=${process.env.APIFY_TOKEN}&memory=${memory}`;
    const response: any = await got({
        url: apiUrl,
        method: 'POST',
        json: actorInput(),
        responseType: 'json',
    });

    const objTaskRun = response.body.data;
    const runTaskData = await getRunTaskData(objTaskRun.id);

    if (runTaskData.status === "SUCCEEDED") {
        const data = await getDataFromStore(runTaskData.defaultDatasetId, fields.join(','), limit, format);
        await saveToKeyValueStore(data);
    }
}

const getRunTaskData = async (actorRunId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const intervalStatusCheck = setInterval(async () => {
            try {
                const objActorRun: any = await checkActorRunStatus(actorRunId);
                if (objActorRun && objActorRun.body.data.status === "SUCCEEDED") {
                    clearInterval(intervalStatusCheck);
                    resolve(objActorRun.body.data);
                }
            } catch (error) {
                log.error("Error occured in actor-runs api.", error);
                clearInterval(intervalStatusCheck);
                reject(error);
            }
        }, 5000);
    });
}

const checkActorRunStatus = async (actorRunId: string): Promise<any> => {
    const apiRunUrl = `https://api.apify.com/v2/actor-runs/${actorRunId}`;
    return got({
        url: apiRunUrl,
        method: 'GET',
        responseType: 'json',
    });
}

const getDataFromStore = async (defaultDatasetId: string, fields: string, limit: number, format: string): Promise<any> => {
    const apiDatasetUrl = `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?format=${format}&limit=${limit}&fields=${fields}`;
    const response = await got({
        url: apiDatasetUrl,
        method: 'GET',
        headers: {
            "Content-Type": "text/csv"
        }
    });
    return response.body;
}

