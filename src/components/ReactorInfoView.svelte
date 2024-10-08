<script lang="ts" context="module">
    import type { Reactor } from "../data/Reactor";
    import { translate } from "../language";
    import { KEY_APPEND_COMMAND, KEY_APPEND_MESSAGE, KEY_GET_CONNECTION, TYPE_APPEND_COMMAND, TYPE_APPEND_MESSAGE, TYPE_GET_CONNECTION } from "../context";
    import { getContext } from "svelte";
    import { simpleResponse } from "../utils/lang";
    import type { TableData } from "../widgits/InfoPanelWithTemperatureBar.svelte";

    function getFactoryData(reactor: Reactor | null): TableData {
        if (!reactor) return [];
        return [
            ["尺寸/槽数", `${reactor.size}/${reactor.slots.length}`, "个"],
            ["宽×长", `${reactor.width}×${reactor.height}`],
            ["运行情况", reactor.status ? "正在" : "停止", "运行"],
            ["状态", translate(reactor.status)],
            ["最高温度", reactor.temperature, "HU/MU"],
        ];
    }
</script>

<script lang="ts">
    import InfoPanelWithTemperatureBar from "../widgits/InfoPanelWithTemperatureBar.svelte";

    export let reactor: Reactor | null;

    $: reactorData = reactor ? getFactoryData(reactor) : [];

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const appendMessage: TYPE_APPEND_MESSAGE = getContext(KEY_APPEND_MESSAGE);
    const appendCommand: TYPE_APPEND_COMMAND = getContext(KEY_APPEND_COMMAND);

    function turn(status: boolean) {
        if (!reactor) return;
        const action = (status ? "启动" : "关闭") + `反应堆${reactor.uid}号`;
        simpleResponse(getConnection().turnReactor(reactor.uid, status), action, appendMessage);
        console.log(action);
        appendCommand(`reactorTurn ${reactor.uid} ${status}`);
    }
</script>

{#if reactor}
    <InfoPanelWithTemperatureBar tableData={reactorData} temperature={reactor.temperature} valves={[reactor.breakingTemperature, reactor.brokenTemperature]}>
        <div class="button-bar fill-x">
            {#if reactor.running}
                <button class="turn-off" on:click={() => turn(false)}>{translate("turn_off")}</button>
            {:else}
                <button class="turn-on" on:click={() => turn(true)}>{translate("turn_on")}</button>
            {/if}
        </div>
    </InfoPanelWithTemperatureBar>
{/if}

<style>
    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    button {
        margin-top: 1em;
        font-size: 1em;
        padding: 0.5em 1em;
        outline: none;
        font-weight: bold;
        border: #ffff00 solid 0.1em;
    }

    button.turn-on {
        background-color: #ffff00;
        color: #000000;
    }

    button.turn-off {
        background-color: #00000070;
        color: #ffff00;
    }
</style>
