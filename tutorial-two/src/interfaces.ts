export interface Url {
    url: string;
    userData?: UserData;
    uniqueKey?: string;
}

export interface UserData {
    label: string;
    keyword?: string;
    asin?: string;
    title?: string;
    description?: string;
    productUrl?: string;
}

export interface ProductDetails {
    title: string;
    description: string;
    keyword: string;
    url: string;
    price?: string;
    shippingPrice?: string;
    sellerName?: string;
}

export interface Email {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export enum EVENT_TYPES {
    CREATED = "ACTOR.RUN.CREATED",
    SUCCEEDED = "ACTOR.RUN.SUCCEEDED",
    FAILED = "ACTOR.RUN.FAILED",
    ABORTED = "ACTOR.RUN.ABORTED",
    TIMEDOUT = "ACTOR.RUN.TIMED_OUT",
}