"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callTaskWithClient = void 0;
const apify_1 = __importDefault(require("apify"));
const apify_client_1 = __importDefault(require("apify-client"));
const tools_1 = require("./tools");
const { utils: { log }, } = apify_1.default;
const apifyClient = new apify_client_1.default({
    token: process.env.APIFY_TOKEN,
});
exports.callTaskWithClient = async (taskId, memory, fields, limit, format) => {
    const taskClient = apifyClient.task(taskId);
    const objTaskRun = await taskClient.start(tools_1.actorInput(), { memory: memory });
    const runTaskData = await getRunTaskData(objTaskRun.id);
    if (runTaskData.status === "SUCCEEDED") {
        const data = await getDataFromStore(runTaskData.defaultDatasetId, fields, limit, format);
        await tools_1.saveToKeyValueStore(data);
    }
};
const getRunTaskData = async (actorRunId) => {
    const runClient = await apifyClient.run(actorRunId);
    return new Promise((resolve, reject) => {
        const intervalStatusCheck = setInterval(async () => {
            try {
                const objActorRun = await runClient.get();
                if (objActorRun && objActorRun.status === "SUCCEEDED") {
                    clearInterval(intervalStatusCheck);
                    resolve(objActorRun);
                }
            }
            catch (error) {
                log.error("Error occured in actor run client.", error);
                clearInterval(intervalStatusCheck);
                reject(error);
            }
        }, 5000);
    });
};
const getDataFromStore = async (defaultDatasetId, fields, limit, format) => {
    const datasetClient = await apifyClient.dataset(defaultDatasetId);
    const objOptions = { limit, fields };
    return await datasetClient.downloadItems(format, objOptions);
};
//# sourceMappingURL=apifyClient.js.map