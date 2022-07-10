<script lang="ts" context="module">
    import { toHeatColorInfinity } from "../graphics/utils";
    import ValueBar from "../widgits/ValueBar.svelte";

    const valueMapper = (n: number) => Math.tanh(n * (1 / 2000));
    const colorMapper = (n: number) => toHeatColorInfinity(n, 1 / 2000);

    export type TableData = Array<[string, any, string?]>;
</script>

<script lang="ts">
    import InfoItem from "./InfoItem.svelte";

    export let tableData: TableData;
    export let temperature: number;
    export let valves: Array<number>;

    let upperHeight: number = 0;
</script>

<div class="TablePanelWithTemperatureBar fill">
    <div class="upper flex-8">
        <div class="info-list flex-9" bind:clientHeight={upperHeight}>
            <!-- <Table data={tableData} weights={[6, 6]} /> -->
            {#each tableData as [title, value, unit]}
                <div class="info-item">
                    <InfoItem {title} {value} unit={unit || ""} />
                </div>
            {/each}
        </div>
        <div class="spacer flex-1" />
        <div
            class="fill-y overflow-hidden"
            style={`
                    width: ${upperHeight / 6.18}px;
                    height: ${upperHeight}px;
                `}
        >
            <ValueBar value={temperature} maxValue={1} {valueMapper} {colorMapper} {valves}>
                <div class="temperature-label">
                    <span>当前温度</span>
                    <span>HU/MU</span>
                </div>
            </ValueBar>
        </div>
    </div>
    <div class="downer flex-4">
        <slot />
    </div>
</div>

<style>
    .TablePanelWithTemperatureBar {
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
    }

    .upper {
        display: flex;
        flex-wrap: nowrap;
    }

    .downer {
        display: flex;
        align-items: flex-end;
    }

    .info-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .info-item {
        padding: 0 0.5em;
        width: 50%;
        font-size: 0.8em;
    }

    .temperature-label {
        font-size: 0.5em;
    }
</style>
