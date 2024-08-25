<script lang="ts" context="module">
    const leftTabs = [
        { text: "发电厂信息", value: "factory-info" },
        { text: "仓库", value: "storage" },
    ];

    const midTabs = [
        { text: "反应堆信息", value: "reactor-info" },
        { text: "商店", value: "shop" },
    ];
</script>

<script lang="ts">
    import { getContext, onDestroy, setContext } from "svelte";
    import FactoryInfoView from "../components/FactoryInfoView.svelte";
    import GameCommandView from "../components/GameCommandView.svelte";
    import ReactorView from "../components/ReactorView.svelte";
    import ShopView from "../components/ShopView.svelte";
    import StorageView from "../components/StorageView.svelte";
    import VitalDataView from "../components/VitalDataView.svelte";
    import { KEY_APPEND_COMMAND, KEY_GET_CONNECTION, TYPE_GET_CONNECTION } from "../context";
    import type { Factory } from "../data/Factory";
import type { FactoryHistory, ReactorHistory } from "../data/History";
    import type { Level } from "../data/Level";
    import type { Reactor } from "../data/Reactor";
    import Panel from "../widgits/Panel.svelte";
    import TabsPanel from "../widgits/TabsPanel.svelte";

    let reactorUid: number = 0;
    let reactor: Reactor | null = null;
    let factory: Factory | null = null;
    let factoryHistory: FactoryHistory | null = null;
    let reactorHistory: ReactorHistory | null = null;
    let level: Level | null = null;
    let updatedTime: number = 0;
    let selectedSlotNumber: number = -1;

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const gameConn = getConnection();

    const onMessage = () => {
        gameConn.getFactoryInfo().then((f) => (factory = f));
        gameConn.getReactorInfo(reactorUid).then((r) => (reactor = r));
        gameConn.getReactorHistory(reactorUid, -10, -1).then((rh) => (reactorHistory = rh));
        gameConn.getFactoryHistory(-10, -1).then((fh) => (factoryHistory = fh));
        gameConn.getLevelInfo().then((l) => (level = l));
        updatedTime = Date.now();
    };
    gameConn.onStateListeners.add(onMessage);
    const onDestroyhandler = () => {
        gameConn.onStateListeners.delete(onMessage);
    };

    onDestroy(onDestroyhandler);

    function setReactorUid(uid: number) {
        reactorUid = uid;
        gameConn.getReactorInfo(reactorUid).then((r) => (reactor = r));
    }

    let commands: string = "";

    function appendCommand(command: string) {
        commands += "\n" + command;
    }
    setContext(KEY_APPEND_COMMAND, appendCommand);

    let leftTab = leftTabs[0].value;
    let midTab = midTabs[0].value;
</script>

<div class="fill MainPage">
    <div class="left">
        <TabsPanel tabs={leftTabs} bind:tab={leftTab}>
            {#if factory}
                {#if leftTab === "factory-info"}
                    <FactoryInfoView {factory} history={factoryHistory} setIndex={setReactorUid} index={reactorUid} />
                {:else if leftTab === "storage"}
                    <StorageView storage={factory.storage} {reactorUid} {selectedSlotNumber} />
                {/if}
            {/if}
        </TabsPanel>
    </div>

    <div class="middle">
        <TabsPanel tabs={midTabs} bind:tab={midTab}>
            {#if midTab === "reactor-info"}
                {#if reactor}
                    <ReactorView {reactor} history={reactorHistory} bind:selectedSlotNumber />
                {/if}
            {:else if midTab === "shop" && factory}
                <ShopView shop={factory.shop} />
            {/if}
        </TabsPanel>
    </div>

    <div class="right">
        <div class="flex-1">
            <Panel>
                <VitalDataView {factory} {level} {updatedTime} />
            </Panel>
        </div>
        <div class="flex-1">
            <Panel>
                <GameCommandView bind:commands />
            </Panel>
        </div>
    </div>
</div>

<style>
    div.MainPage {
        display: flex;
        flex-direction: row;
        font-size: 2vh;
        padding: 1em;
    }

    div.right,
    div.middle,
    div.right {
        height: 100%;
    }

    div.middle {
        flex: 6;
        text-align: center;
        margin-left: 1em;
        margin-right: 1em;
        display: flex;
        flex-direction: column;
    }

    div.left,
    div.right {
        flex: 3;
        display: flex;
        flex-direction: column;
    }

    div.right > *:first-child {
        padding-bottom: 1em;
    }
</style>
