import type { Factory } from "../data/Factory";
import type { Reactor } from "../data/Reactor";
import type { ServerPack } from "../data/ServerPack";

export interface GenericMessageHandlerProps {
    onReceiveFactory: (factory: Factory) => void;
    onReceiveReactor: (reactor: Reactor, index: number) => void;
}

export function createGenericMessageHandler(props: GenericMessageHandlerProps) {
    return (pack: ServerPack) => {
		if (pack.type === "state") {
			for (const res of pack.data) {
				if (!res.succeeded) continue;
				switch (res.id) {
					case "factory_info":
						props.onReceiveFactory(res.data);
						break;
					case "reactor_info":
                        props.onReceiveReactor(res.data, res.data.index);
						break;
				}
			}
		}
    };
} 