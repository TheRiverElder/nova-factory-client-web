<script lang="ts" context="module">
    import type { CellSlot } from "../data/CellSlot";
    import type { Reactor } from "../data/Reactor";
    import { constraints } from "../graphics/utils";
    import { translate } from "../language";

    function getSlotData(slot: CellSlot | null): TableData {
        if (!slot) return [];
        return [
            ["编号", "#" + slot.number],
            ["处于反应堆位置", `(${slot.x}, ${slot.y})`],
            ["深度", (slot.depth * 100).toFixed(1), "%"],
            ["温度", slot.temperature, "HU/MU"],
            ["元件类型", slot.cell ? translate(slot.cell.id) : "无"],
        ];
    }
</script>

<script lang="ts">
    import { KEY_APPEND_COMMAND, TYPE_APPEND_COMMAND } from "../context";
    import { getContext } from "svelte";
    import type { TableData } from "../widgits/InfoPanelWithTemperatureBar.svelte";
    import InfoPanelWithTemperatureBar from "../widgits/InfoPanelWithTemperatureBar.svelte";

    export let cellSlot: CellSlot | null;
    export let reactor: Reactor | null;

    const appendCommand: TYPE_APPEND_COMMAND = getContext(KEY_APPEND_COMMAND);

    $: slotData = cellSlot ? getSlotData(cellSlot) : [];
    $: displayNewDepth = newDepth < 0 && cellSlot ? cellSlot.depth : newDepth;

    let newDepth: number = -1;

    function cancelSetDepth() {
        newDepth = -1;
    }

    function setDepth() {
        if (newDepth < 0 || !reactor || !cellSlot || newDepth === cellSlot.depth) return;
        const action = `将反应堆${reactor.uid}号的${cellSlot.number}号单元槽深度设置为${newDepth}`;
        console.log(action);
        appendCommand(`setDepth ${reactor.uid} ${cellSlot.number} ${newDepth}`);
    }

    function pullCell() {
        if (!reactor || !cellSlot) return;
        const action = `将反应堆${reactor.uid}号的${cellSlot.number}号单元槽脱出`;
        console.log(action);
        appendCommand(`pull ${reactor.uid} ${cellSlot.number}`);
    }
</script>

{#if reactor && cellSlot}
    <InfoPanelWithTemperatureBar tableData={slotData} temperature={cellSlot.temperature} valves={[reactor.breakingTemperature, reactor.brokenTemperature]}>
        {#if cellSlot.cell}
            <div class="controls fill-x">
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
            </div>
        {/if}
    </InfoPanelWithTemperatureBar>
{/if}

<style>
    .controls {
        display: flex;
        flex-direction: column;
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
</style>
