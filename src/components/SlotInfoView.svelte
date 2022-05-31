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

    const valueMapper = (n: number) => Math.tanh(n * (1 / 5000));
    const colorMapper = (n: number) => toHeatColorInfinity(n, 1 / 2000);
</script>

<script lang="ts">
    import { KEY_GET_CONNECTION, TYPE_GET_CONNECTION } from "../context";
    import { getContext } from "svelte";

    export let cellSlot: CellSlot | null;
    export let reactor: Reactor | null;
    export let reactorIndex: number;

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);

    $: slotData = cellSlot ? getSlotData(cellSlot) : [];
    $: displayNewDepth = newDepth < 0 && cellSlot ? cellSlot.depth : newDepth;

    let newDepth: number = -1;

    function cancelSetDepth() {
        newDepth = -1;
    }

    function setDepth() {
        if (newDepth < 0 || !reactor || !cellSlot || newDepth === cellSlot.depth) return;
        console.log(`set depth to ${newDepth}`);
        getConnection().send({
            head: "setDepth",
            args: {
                reactorIndex,
                slotNumber: cellSlot.number,
                depth: newDepth,
            },
        });
    }
</script>

{#if reactor && cellSlot}
    <div class="SlotInfoView fill">
        <div class="upper">
            <div class="flex-1">
                <Table data={slotData} weights={[6, 6]} />
            </div>
            <ValueBar value={cellSlot.temperature} maxValue={1} {valueMapper} {colorMapper} valves={[reactor.breakingTemperature, reactor.brokenTemperature]} />
        </div>
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
        </div>
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
    }

    button.set {
        background-color: #ffff00;
        color: #000000;
    }

    button.cancel {
        background-color: #00000070;
        color: #ffff00;
    }
</style>
