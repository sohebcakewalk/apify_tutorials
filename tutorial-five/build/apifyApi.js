"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callTaskWithApi = void 0;
const apify_1 = __importDefault(require("apify"));
const got_1 = __importDefault(require("got"));
const tools_1 = require("./tools");
const { utils: { log }, } = apify_1.default;
exports.callTaskWithApi = async (taskId, memory, fields, limit, format) => {
    const apiUrl = `https://api.apify.com/v2/actor-tasks/${taskId}/runs?token=${process.env.APIFY_TOKEN}&memory=${memory}`;
    const response = await got_1.default({
        url: apiUrl,
        method: 'POST',
        json: tools_1.actorInput(),
        responseType: 'json',
    });
    const objTaskRun = response.body.data;
    const runTaskData = await getRunTaskData(objTaskRun.id);
    if (runTaskData.status === "SUCCEEDED") {
        const data = await getDataFromStore(runTaskData.defaultDatasetId, fields.join(','), limit, format);
        await tools_1.saveToKeyValueStore(data);
    }
};
const getRunTaskData = async (actorRunId) => {
    return new Promise((resolve, reject) => {
        const intervalStatusCheck = setInterval(async () => {
            try {
                const objActorRun = await checkActorRunStatus(actorRunId);
                if (objActorRun && objActorRun.body.data.status === "SUCCEEDED") {
                    clearInterval(intervalStatusCheck);
                    resolve(objActorRun.body.data);
                }
            }
            catch (error) {
                log.error("Error occured in actor-runs api.", error);
                clearInterval(intervalStatusCheck);
                reject(error);
            }
        }, 5000);
    });
};
const checkActorRunStatus = async (actorRunId) => {
    const apiRunUrl = `https://api.apify.com/v2/actor-runs/${actorRunId}`;
    return got_1.default({
        url: apiRunUrl,
        method: 'GET',
        responseType: 'json',
    });
};
const getDataFromStore = async (defaultDatasetId, fields, limit, format) => {
    const apiDatasetUrl = `https://api.apify.com/v2/datasets/${defaultDatasetId}/items?format=${format}&limit=${limit}&fields=${fields}`;
    const response = await got_1.default({
        url: apiDatasetUrl,
        method: 'GET',
        headers: {
            "Content-Type": "text/csv"
        }
    });
    return response.body;
};
//# sourceMappingURL=apifyApi.js.map