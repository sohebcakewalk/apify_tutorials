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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
const tools = __importStar(require("./tools"));
const apifyApi_1 = require("./apifyApi");
const apifyClient_1 = require("./apifyClient");
const { utils: { log }, } = apify_1.default;
apify_1.default.main(async () => {
    log.info("Starting actor.");
    const input = await tools.getInput();
    if (input.useClient) {
        log.info("Starting task with apify-client");
        await apifyClient_1.callTaskWithClient("sohebrapati~tutorial-five-task", input.memory, input.fields, input.maxItems, input.format = "csv");
        log.info("Completed task with apify-client");
    }
    else {
        log.info("Starting task with Api");
        await apifyApi_1.callTaskWithApi("sohebrapati~tutorial-five-task", input.memory, input.fields, input.maxItems, input.format = "csv");
        log.info("Completed task with Api");
    }
});
//# sourceMappingURL=main.js.map