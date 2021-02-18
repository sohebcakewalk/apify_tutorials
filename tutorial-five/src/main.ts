import Apify from 'apify';
import * as tools from './tools';
import { callTaskWithApi } from './apifyApi';
import { callTaskWithClient } from './apifyClient';
const {
    utils: { log },
} = Apify;

Apify.main(async (): Promise<void> => {
    log.info("Starting actor.");

    const input = await tools.getInput();

    if (input.useClient) {
        log.info("Starting task with apify-client");
        
        await callTaskWithClient("sohebrapati~tutorial-five-task", input.memory, input.fields, input.maxItems, input.format = "csv")
        
        log.info("Completed task with apify-client");
    } else {
        log.info("Starting task with Api");
        
        await callTaskWithApi("sohebrapati~tutorial-five-task", input.memory, input.fields, input.maxItems, input.format = "csv");
        
        log.info("Completed task with Api");
    }
});