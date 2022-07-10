<script lang="ts" context="module">
    import Table from "../widgits/Table.svelte";
    import type { Reactor } from "../data/Reactor";
    import { translate } from "../language";
    import ValueBar from "../widgits/ValueBar.svelte";
    import { toHeatColorInfinity } from "../graphics/utils";
    import { KEY_APPEND_COMMAND, KEY_APPEND_MESSAGE, KEY_GET_CONNECTION, TYPE_APPEND_COMMAND, TYPE_APPEND_MESSAGE, TYPE_GET_CONNECTION } from "../context";
    import { getContext } from "svelte";
    import { simpleResponse } from "../utils/lang";

    function getFactoryData(reactor: Reactor | null) {
        if (!reactor) return [];
        return [
            ["尺寸", reactor.size],
            ["宽度", reactor.width],
            ["长度", reactor.height],
            ["正在运行", reactor.running ? "是" : "否"],
            ["单元槽数量", reactor.slots.length],
            ["状态", translate(reactor.status)],
            ["最高温度", reactor.temperature.toFixed(2) + "K"],
        ];
    }

    const valueMapper = (n: number) => Math.tanh(n * (1 / 2000));
    const colorMapper = (n: number) => toHeatColorInfinity(n, 1 / 2000);
</script>

<script lang="ts">
    export let reactor: Reactor | null;

    let upperHeight: number = 0;

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
    <div class="ReactorInfoView fill overflow-hidden">
        <div class="upper flex-1 overflow-hidden">
            <div class="flex-8" bind:clientHeight={upperHeight}>
                <Table data={reactorData} weights={[6, 6]} />
            </div>
            <div class="spacer flex-2"/>
            <div
                class="flex-2 fill-y overflow-hidden"
                style={`
                    width: 5em;
                    height: ${upperHeight}px;
                `}
            >
                <ValueBar
                    value={reactor.temperature}
                    maxValue={1}
                    {valueMapper}
                    {colorMapper}
                    valves={[reactor.breakingTemperature, reactor.brokenTemperature]}
                >
                    <div class="temperature-label">
                        <span>当前温度</span>
                        <span>HU/MU</span>
                    </div>
                </ValueBar>
            </div>
        </div>
        <div class="button-bar">
            {#if reactor.running}
                <button class="turn-off" on:click={() => turn(false)}>{translate("turn_off")}</button>
            {:else}
                <button class="turn-on" on:click={() => turn(true)}>{translate("turn_on")}</button>
            {/if}
        </div>
    </div>
{/if}

<style>
    .ReactorInfoView {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
    }

    .upper {
        display: flex;
        flex-wrap: nowrap;
    }

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

    .temperature-label {
        font-size: 0.5em;
    }
</style>
