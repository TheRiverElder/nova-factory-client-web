<script lang="ts" context="module">
    function wrap(value: any): string {
        if (value === undefined || value === null) return "--";
        else return shortenNumber(value);
    }
</script>

<script lang="ts">
    import type { Factory } from "../data/Factory";
    import type { Level } from "../data/Level";
    import { shortenNumber } from "../utils/numebr-display";

    export let factory: Factory | null;
    export let level: Level | null;

    $: data = [
        { title: "最新能量", value: factory?.lastGenElectricity, unit: "EU" },
        { title: "能量需求", value: level?.requirement, unit: "EU" },
        { title: "当前电价", value: level?.price, unit: "CU/EU" },
        { title: "运行中反应堆数量", value: factory?.reactors.filter((it) => it.running).length, unit: "个" },
    ];
</script>

<div class="VitalDataView fill">
    {#each data as { title, value, unit }}
        <div class="vital-data">
            <div class="vital-data-title flex-1">
                <span>{title}</span>
            </div>
            <div class="vital-data-content">
                <span class="value">{wrap(value)}</span>
                <span class="unit">{unit}</span>
            </div>
        </div>
    {/each}
</div>

<style>
    .VitalDataView {
        padding: 1.5em;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
        align-items: flex-start;
        align-content: flex-start;
    }

    .vital-data {
        width: 50%;
        padding: 0.5em;
    }

    .vital-data-title {
        font-style: italic;
        text-align: start;
    }

    .vital-data-content {
        font-family: "Milibus Sb";
        font-size: 1.5em;
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
    }

    .vital-data-content > .value {
        font-size: 1em;
    }

    .vital-data-content > .unit {
        margin-left: 1em;
        font-size: 0.5em;
    }
</style>
