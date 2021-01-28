import Apify from 'apify';
import * as tools from './tools';
const {
    utils: { log },
} = Apify;

Apify.main(async (): Promise<void> => {
    log.info("Starting actor (tutorial-three).");
    await tools.processCheapestOffer();
});