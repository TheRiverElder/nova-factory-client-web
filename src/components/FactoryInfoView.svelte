<script lang="ts" context="module">
    import type { Factory } from "../data/Factory";
import { translate } from "../language";
    import Table from "../widgits/Table.svelte";

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

    $: factoryData = factory ? getFactoryData(factory) : [];
</script>

{#if factory}
    <div class="FactoryInfoView fill">
        <Table data={factoryData} weights={[6, 6]} />
        <p>{factory.levelInfo}</p>
        <div>
            {#each factory.reactors as r, i}
                <div class="reactor-item" class:selected={index === i} on:click={() => setIndex(i)}>
                    <span>{r.index}</span>
                    <span>:</span>
                    <span>{translate(r.running ? 'running' : 'sleeping')}</span>
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
    }

    .reactor-item {
        cursor: pointer;
        padding: .2em 2em;
    }

    .reactor-item.selected {
        cursor: auto;
        background-color: #ffff00;
        color: #000000;
    }
</style>
