<script lang="ts">
    import type { Factory } from "../data/Factory";
    import type { Level } from "../data/Level";
    import InfoItem from "../widgits/InfoItem.svelte";

    export let factory: Factory | null;
    export let level: Level | null;
    export let updatedTime: number = 0;

    $: data = [
        { title: "最新能量", value: factory?.lastGenElectricity, unit: "EU" },
        { title: "能量需求", value: level?.requirement, unit: "EU" },
        { title: "当前电价", value: level?.price, unit: "CU/EU" },
        { title: "运行中反应堆数量", value: factory?.reactors.filter((it) => it.running).length, unit: "个" },
        { title: "更新时间", value: new Date(updatedTime).toLocaleString() },
    ];
</script>

<div class="VitalDataView fill">
    {#each data as { title, value, unit }}
        <div class="vital-data">
            <InfoItem {title} {value} {unit} />
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
    }
</style>
