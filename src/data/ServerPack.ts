export type ServerPack = ResponseServerPack | StateServerPack;

export interface ResponseServerPack {
    "type": "response";
    "clientId": number;
    "succeeded": boolean;
    "message": string;
    "data": any;
}

export interface StateServerPack {
    "type": "state";
    "data": Array<{
        "id": string;
        "succeeded": boolean;
        "message": string;
        "data": any;
    }>;
}