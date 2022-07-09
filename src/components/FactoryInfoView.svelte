<script lang="ts" context="module">
    import type { Factory } from "../data/Factory";
    import { translate } from "../language";
    import Table from "../widgits/Table.svelte";
    import Chart from "../widgits/Chart.svelte";
    import type { FactoryHistory } from "../data/History";
    import { KEY_GET_CONNECTION, TYPE_GET_CONNECTION } from "../context";
    import { afterUpdate, getContext } from "svelte";

    function getFactoryData(factory: Factory | null) {
        if (!factory) return [];
        return [
            ["账户余额", factory.account.toFixed(2)],
            ["电量缓存", factory.buttery.toFixed(2)],
            ["反应堆数量", factory.reactors.length],
        ];
    }
</script>

<script lang="ts">
    export let factory: Factory | null;
    export let index: number;
    export let setIndex: (i: number) => void;
    let history: FactoryHistory | null;

    let barWidth: number = 0;

    $: factoryData = factory ? getFactoryData(factory) : [];

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const gameConn = getConnection();

    afterUpdate(onUpdate);

    function onUpdate() {
        gameConn.getFactoryHistory(-10, -1).then((h) => (history = h));
    }
</script>

{#if factory}
    <div class="FactoryInfoView fill">
        <Table data={factoryData} weights={[6, 6]} />
        <div class="fill-x" bind:clientWidth={barWidth}>
            <Chart data={history} minRange={1000} width={barWidth} height={barWidth * 0.8} padding={barWidth * 0.05} min={0} />
        </div>
        <p>反应堆列表：</p>
        <div>
            {#each factory.reactors as r, i}
                <div class="reactor-item" class:selected={index === i} on:click={() => setIndex(i)}>
                    <span>{r.index}</span>
                    <span>:</span>
                    <span>{translate(r.running ? "running" : "sleeping")}</span>
                    <span>|</span>
                    <span>{r.size}槽</span>
                    <span>|</span>
                    <span>{r.temperature.toFixed(2)}K</span>
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .FactoryInfoView {
        padding: 1em;
    }

    .reactor-item {
        cursor: pointer;
        padding: 0.2em 2em;
    }

    .reactor-item.selected {
        cursor: auto;
        background-color: #ffff00;
        color: #000000;
    }
</style>
