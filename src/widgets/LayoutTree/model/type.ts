
export interface JsonInfo {
    id: string;
    name: string;
    toggled?: boolean;
    type: "STRING" | "NUMBER" | "BOOLEAN" | "OBJECT" | "ARRAY STRING" | "ARRAY OBJECT";
    value?: number; // Keep this as number for single select
    children?: JsonInfo[];
}


export interface KeyValue {
    key: string;
    value: string;
}