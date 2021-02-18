export interface InputFields {
    memory: number;
    useClient: boolean;
    fields: string[];
    maxItems: number;
    format: format;
}

type format = "json" | "jsonl" | "csv" | "html" | "xlsx" | "xml" | "rss";