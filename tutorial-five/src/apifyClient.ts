import Apify from 'apify';
import ApifyClient from 'apify-client';
import { actorInput, saveToKeyValueStore } from "./tools";
const {
    utils: { log },
} = Apify;

const apifyClient = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

export const callTaskWithClient = async (taskId: string, memory: number, fields: string[], limit: number, format: string): Promise<void> => {
    const taskClient = apifyClient.task(taskId);
    const objTaskRun = await taskClient.start(actorInput(), { memory: memory });
    const runTaskData = await getRunTaskData(objTaskRun.id);

    if (runTaskData.status === "SUCCEEDED") {
        const data = await getDataFromStore(runTaskData.defaultDatasetId, fields, limit, format);
        await saveToKeyValueStore(data);
    }
}

const getRunTaskData = async (actorRunId: string): Promise<any> => {
    const runClient = await apifyClient.run(actorRunId);
    return new Promise((resolve, reject) => {
        const intervalStatusCheck = setInterval(async () => {
            try {
                const objActorRun: any = await runClient.get();
                if (objActorRun && objActorRun.status === "SUCCEEDED") {
                    clearInterval(intervalStatusCheck);
                    resolve(objActorRun);
                }
            } catch (error) {
                log.error("Error occured in actor run client.", error);
                clearInterval(intervalStatusCheck);
                reject(error);
            }
        }, 5000);
    });
}

const getDataFromStore = async (defaultDatasetId: string, fields: string[], limit: number, format: string): Promise<any> => {
    const datasetClient = await apifyClient.dataset(defaultDatasetId);
    const objOptions = { limit, fields }
    return await datasetClient.downloadItems(format, objOptions);
}