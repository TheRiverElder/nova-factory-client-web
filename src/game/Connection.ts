import type { ClientPack } from "../data/ClientPack";
import type { ServerPack } from "../data/ServerPack";

export type Handler<T> = (arg: T) => void;
export type OpenHandler = Handler<void>;
export type MessageHandler = Handler<ServerPack>;
export type CloseHandler = Handler<void>;

export class Connection {

    public autoReconnect: boolean = true;
    private socket: WebSocket;
    public readonly onOpenHandlers: Set<OpenHandler> = new Set();
    public readonly onMessageHandlers: Set<MessageHandler> = new Set();
    public readonly onCloseHandlers: Set<CloseHandler> = new Set();

    private packQueue: Array<ClientPack> = [];

    constructor(url: string) {
        this.initializeWS(url);
    }

    private initializeWS(url: string) {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => this.flushPackQueue();
        this.socket.onmessage = ev => this.handleRawMessage(ev.data as string);
        this.socket.onerror = () => {
            if (this.autoReconnect) {
                this.initializeWS(url);
            }
        };
    }

    private handleRawMessage(data: string) {
        try {
            const json = JSON.parse(data);
            this.onMessage(json as ServerPack);
        } catch (e) {
            console.error(e, data);
        }
    }

    private onMessage(pack: ServerPack) {
        this.onMessageHandlers.forEach(handle => handle(pack));
    }

    public send(pack: ClientPack) {
        this.packQueue.push(pack);
        this.flushPackQueue();
    }

    private flushPackQueue() {
        while(this.socket.readyState === WebSocket.OPEN && this.packQueue.length > 0) {
            this.socket.send(JSON.stringify(this.packQueue.shift()));
        }
    }

    public close() {
        this.socket.close();
    }
}
