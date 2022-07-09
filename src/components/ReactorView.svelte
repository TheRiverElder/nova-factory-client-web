<script lang="ts" context="module">
</script>

<script lang="ts">
    import { afterUpdate, getContext, onDestroy, onMount } from "svelte";
    import ReactorInfoView from "../components/ReactorInfoView.svelte";
    import SlotInfoView from "../components/SlotInfoView.svelte";
    import { KEY_GET_CONNECTION, TYPE_GET_CONNECTION } from "../context";
    import type { ReactorHistory } from "../data/History";
    import type { Reactor } from "../data/Reactor";
    import { Context2dReactorGraphic } from "../graphics/Context2dReactorGraphic";
    import Chart from "../widgits/Chart.svelte";

    let canvasWrapper: HTMLDivElement;
    let canvas: HTMLCanvasElement;

    export let reactor: Reactor;
    export let selectedSlotNumber: number;
    let history: ReactorHistory | null;

    let chartWidth: number = 0;

    const graphic = new Context2dReactorGraphic();

    const getConnection: TYPE_GET_CONNECTION = getContext(KEY_GET_CONNECTION);
    const gameConn = getConnection();

    onMount(() => {
        resizeCanvas();
        graphic.init(canvas, (n) => (selectedSlotNumber = n));
        redraw();
    });
    onDestroy(() => graphic.dispose());
    afterUpdate(onUpdate);

    function onUpdate() {
        resizeAndRedraw();
        gameConn.getReactorHistory(reactor.uid, -10, -1).then((h) => (history = h));
    }

    function resizeCanvas() {
        const canvasRect = canvasWrapper.getBoundingClientRect();
        const slotSize = Math.floor(Math.min(canvasRect.width / reactor.width, canvasRect.height / reactor.height) * 0.9);
        // console.log({ canvasRect, slotSize });
        canvas.width = reactor.width * slotSize;
        canvas.height = reactor.height * slotSize;
    }

    function resizeAndRedraw() {
        resizeCanvas();
        redraw();
    }

    function redraw() {
        if (reactor) {
            graphic.render(reactor);
        }
    }
</script>

<svelte:window on:resize={resizeAndRedraw} />

<div class="ReactorView fill">
    <div class="upper">
        <h2 class="title">
            {#if reactor} 反应堆 {reactor.uid} 号 {/if}
        </h2>
        <div class="graphs" bind:this={canvasWrapper}>
            <div class="graph-wrapper">
                <canvas bind:this={canvas} />
            </div>
            <div class="graph-wrapper" bind:clientWidth={chartWidth}>
                <Chart data={history} minRange={1000} width={chartWidth} height={chartWidth * 0.8} padding={chartWidth * 0.05} min={0} />
            </div>
        </div>
    </div>

    <div class="downer">
        <div class="down-left">
            <h3 class="title">反应堆信息</h3>
            <div>
                {#if reactor}
                    <ReactorInfoView {reactor} />
                {/if}
            </div>
        </div>
        <div class="down-right">
            <h3 class="title">单元槽信息</h3>
            <div>
                {#if reactor && selectedSlotNumber >= 0}
                    <SlotInfoView cellSlot={reactor.slots[selectedSlotNumber]} {reactor} />
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    div.ReactorView {
        display: flex;
        flex-direction: column;
        font-size: 2vh;
        padding: 1em;
    }

    div.upper,
    div.downer {
        width: 100%;
        overflow: hidden;
    }

    div.down-left,
    div.down-right {
        padding: 0 1em;
        height: 100%;
        flex: 1;
    }

    div.upper {
        flex: 6;
        display: flex;
        flex-direction: column;
    }

    div.downer {
        flex: 6;
        display: flex;
        flex-direction: row;
    }

    .graphs {
        display: flex;
        justify-content: space-evenly;
    }

    .graph-wrapper {
        flex: 1;
        padding: 0;
        overflow: hidden;
    }

    canvas {
        cursor: pointer;
        box-shadow: #ffff00 0 0 0.5em;
        border-radius: 0.2em;
        border: #ffff00 solid 0.1em;
    }

    .title {
        margin-top: 0;
    }
</style>
