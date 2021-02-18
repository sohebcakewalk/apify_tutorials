import * as Apify from "apify";
import { InputFields } from "./interfaces";

export const getInput = async (): Promise<InputFields> => {
    const input: InputFields = <InputFields>(await Apify.getInput());
    return input;
};

export const saveToKeyValueStore = async (data: any): Promise<void> => {
    await Apify.setValue('OUTPUT', data, { contentType: "text/csv" });
}

export const actorInput = (): any => {
    return { keyword: 'phone' };
}