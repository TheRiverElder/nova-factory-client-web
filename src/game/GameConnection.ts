import type { ClientPack } from "../data/ClientPack";
import type { Factory } from "../data/Factory";
import type { FactoryHistory, ReactorHistory } from "../data/History";
import type { Reactor } from "../data/Reactor";
import type { ServerPack, StateServerPack } from "../data/ServerPack";
import type { Connection, Handler } from "./Connection";


type UnhandledRequest = [(data: any) => void, (reason: string) => void, NodeJS.Timer | null];

export class GameConnection {

    public readonly connection: Connection;
    public readonly onStateListeners = new Set<Handler<StateServerPack>>();

    private readonly unhandledRequests = new Map<number, UnhandledRequest>();
    public timeout: number = 10000;

    constructor(connection: Connection) {
        this.connection = connection;
        this.connection.onMessageHandlers.add(this.handlePack);
    }


    private idCounter = 0;

    private genId() {
        return this.idCounter++;
    }

    private handlePack = (pack: ServerPack) => {
        if (pack.type === 'response') {
            const clientId = pack.clientId;
            const [resolve, reject, pid] = this.unhandledRequests.get(clientId);
            if (pack.succeeded && resolve) {
                resolve(pack.data);
            } else if (!pack.succeeded && reject) {
                reject(pack.message);
            }
            if (pid !== null) {
                clearTimeout(pid);
            }
            this.unhandledRequests.delete(clientId);
        } else if (pack.type === "state") {
            this.onStateListeners.forEach(l => l(pack));
        }
    }

    public dispose() {
        this.connection.onMessageHandlers.delete(this.handlePack);
        for (const [resolve, reject, pid] of this.unhandledRequests.values()) {
            reject("Game connection disposed.");
            clearTimeout(pid);
        }
    }

    private async sendPack<TResData>(pack: ClientPack): Promise<TResData> {
        return new Promise((resolve, reject) => {
            this.connection.send(pack);
            let pid = null;
            if (this.timeout > 0 && isFinite(this.timeout)) {
                pid = setTimeout(() => reject("Timeout"), this.timeout);
            }
            this.unhandledRequests.set(pack.clientId, [resolve, reject, pid]);
        });
    }

    public async getFactoryInfo(): Promise<Factory> {
        return this.sendPack({
            clientId: this.genId(),
            head: "getFactoryInfo",
            args: {},
        });
    }

    public async getReactorInfo(index: number): Promise<Reactor> {
        return this.sendPack({
            clientId: this.genId(),
            head: "getReactorInfo",
            args: {
                reactorIndex: index,
            },
        });
    }

    // start: time of tick, inclusive
    // end: time of tick, exclusive
    // should: start <= end
    // they can be negative, -n for history[history.length - n]
    public async getFactoryHistory(start: number, end: number): Promise<FactoryHistory> {
        return this.sendPack({
            clientId: this.genId(),
            head: "getFactoryHistory",
            args: { start, end },
        });
    }

    // start: time of tick, inclusive
    // end: time of tick, exclusive
    // should: start <= end
    // they can be negative, -n for history[history.length - n]
    public async getReactorHistory(index: number, start: number, end: number): Promise<ReactorHistory> {
        return this.sendPack({
            clientId: this.genId(),
            head: "getReactorHistory",
            args: {
                reactorIndex: index,
                start,
                end,
            },
        });
    }

    public async turnFactory(status: boolean): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "turnFactory",
            args: { status },
        });
    }

    public async turnReactor(index: number, status: boolean): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "turnReactor",
            args: { 
                reactorIndex: index,
                status, 
            },
        });
    }

    public async setSlotDepth(reactorIndex: number, slotNumber: number, depth: number): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "setSlotDepth",
            args: { 
                reactorIndex,
                slotNumber,
                depth, 
            },
        });
    }

    public async buy(shopItemIndex: number): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "buy",
            args: { shopItemIndex },
        });
    }

    public async use(reactorIndex: number, slotNumber: number, storageItemIndex: number): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "use",
            args: {
                reactorIndex,
                slotNumber,
                storageItemIndex,
            },
        });
    }

    public async sell(storageItemIndex: number): Promise<void> {
        return this.sendPack({
            clientId: this.genId(),
            head: "sell",
            args: { storageItemIndex },
        });
    }
}