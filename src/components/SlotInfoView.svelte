<script lang="ts" context="module">
    import type { CellSlot } from "../data/CellSlot";
    import type { Reactor } from "../data/Reactor";
    import { constraints, toHeatColorInfinity } from "../graphics/utils";
    import { translate } from "../language";
    import Table from "../widgits/Table.svelte";
    import ValueBar from "../widgits/ValueBar.svelte";

    function getSlotData(slot: CellSlot | null) {
        if (!slot) return [];
        return [
            ["编号", "#" + slot.number],
            ["x", slot.x],
            ["y", slot.y],
            ["深度", (slot.depth * 100).toFixed(2) + "%"],
            ["温度", slot.temperature.toFixed(2) + "K"],
            ["元件类型", slot.cell ? translate(slot.cell.id) : "无"],
        ];
    }

    const valueMapper = (n: number) => Math.tanh(n * (1 / 2000));
    const colorMapper = (n: number) => toHeatColorInfinity(n, 1 / 2000);
</script>

<script lang="ts">
    import { KEY_APPEND_COMMAND, KEY_APPEND_MESSAGE, KEY_GET_CONNECTION, TYPE_APPEND_COMMAND, TYPE_APPEND_MESSAGE, TYPE_GET_CONNECTION } from "../context";
    import { getContext } from "svelte";
    import { simpleResponse } from "../utils/lang";

    export let cellSlot: CellSlot | null;
    export let reactor: Reactor | null;

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const appendMessage: TYPE_APPEND_MESSAGE = getContext(KEY_APPEND_MESSAGE);
    const appendCommand: TYPE_APPEND_COMMAND = getContext(KEY_APPEND_COMMAND);

    $: slotData = cellSlot ? getSlotData(cellSlot) : [];
    $: displayNewDepth = newDepth < 0 && cellSlot ? cellSlot.depth : newDepth;

    let newDepth: number = -1;
    let upperHeight: number = 0;

    function cancelSetDepth() {
        newDepth = -1;
    }

    function setDepth() {
        if (newDepth < 0 || !reactor || !cellSlot || newDepth === cellSlot.depth) return;
        const action = `将反应堆${reactor.uid}号的${cellSlot.number}号单元槽深度设置为${newDepth}`;
        // simpleResponse(getConnection().setSlotDepth(reactor.uid, cellSlot.number, newDepth), action, appendMessage);
        console.log(action);
        appendCommand(`setDepth ${reactor.uid} ${cellSlot.number} ${newDepth}`);
    }

    function pullCell() {
        if (!reactor || !cellSlot) return;
        // if (cellSlot.depth > 0) {
        //     appendMessage("插入深度大于0时不能脱出！");
        //     return;
        // }
        const action = `将反应堆${reactor.uid}号的${cellSlot.number}号单元槽脱出`;
        // simpleResponse(getConnection().pull(reactor.uid, cellSlot.number), action, appendMessage);
        console.log(action);
        appendCommand(`pull ${reactor.uid} ${cellSlot.number}`);
    }
</script>

{#if reactor && cellSlot}
    <div class="SlotInfoView fill">
        <div class="upper">
            <div class="flex-10" bind:clientHeight={upperHeight}>
                <Table data={slotData} weights={[6, 6]} />
            </div>
            <div
                class="flex-2 fill-y overflow-hidden"
                style={`
                    width: 5em;
                    height: ${upperHeight}px;
                `}
            >
                <ValueBar
                    value={cellSlot.temperature}
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
        {#if cellSlot.cell}
            <div class="new-depth-wrapper">
                <span>新深度：{(displayNewDepth * 100).toFixed(2)}%</span>
                <input
                    type="range"
                    step={0.01}
                    min={0}
                    max={1}
                    value={displayNewDepth}
                    on:input={(e) => (newDepth = constraints(Number(e.currentTarget.value), 0, 1))}
                />
            </div>
            <div class="button-bar">
                <button class="set" on:click={setDepth}>{translate("set")}</button>
                <button class="cancel" on:click={cancelSetDepth}>{translate("cancel")}</button>
                <button class="pull" on:click={pullCell}>{translate("pull")}</button>
            </div>
        {/if}
    </div>
{/if}

<style>
    .SlotInfoView {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
    }

    .upper {
        display: flex;
        flex-wrap: nowrap;
    }

    .new-depth-wrapper {
        width: 100%;
    }

    .new-depth-wrapper > input {
        width: 100%;
    }

    .button-bar {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    button {
        font-size: 1em;
        padding: 0.5em 1em;
        outline: none;
        font-weight: bold;
        border: #ffff00 solid 0.1em;
        background-color: #00000070;
        color: #ffff00;
    }

    button.set {
        background-color: #ffff00;
        color: #000000;
    }

    .temperature-label {
        font-size: 0.5em;
    }
</style>
